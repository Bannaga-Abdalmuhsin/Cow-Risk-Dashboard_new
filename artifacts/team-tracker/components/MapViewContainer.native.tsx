/**
 * Native Google Maps WebView container with smooth 1 s marker interpolation.
 *
 * Architecture:
 *  - Initial HTML is built ONCE (useMemo with empty deps) — the WebView never
 *    reloads when locations change.
 *  - Location updates are injected via webviewRef.injectJavaScript() into the
 *    already-running map page, which calls window.updateMarkers(data).
 *  - window.updateMarkers() animates existing markers from old → new lat/lng
 *    using requestAnimationFrame with an ease-in-out curve over 1 000 ms.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { type TechLocationWithUser } from "@/lib/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyBimHwfRUw7XWVE4QjFKUbIjm6PaPsEX4M";
const MAKKAH_LAT = 21.38;
const MAKKAH_LNG = 39.93;

interface Props {
  locations:     TechLocationWithUser[];
  onDutyColor:   string;
  offDutyColor:  string;
  onMarkerPress: (loc: TechLocationWithUser) => void;
}

function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

interface MarkerData {
  lat:      number;
  lng:      number;
  color:    string;
  label:    string;
  mins:     number;
  fresh:    boolean;
  userId:   number;
  area:     string;
  userName: string;
}

function buildMarkerData(locations: TechLocationWithUser[]): MarkerData[] {
  return locations.map(loc => {
    const mins  = minutesAgo(loc.updatedAt);
    const fresh = mins < 10;
    return {
      lat: loc.lat, lng: loc.lng,
      color: fresh ? "#16a34a" : "#dc2626",
      label: loc.userName.split(" ")[0],
      mins, fresh,
      userId:   loc.userId,
      area:     loc.area ?? "—",
      userName: loc.userName,
    };
  });
}

/** Builds the static shell HTML — called once at mount. */
function buildInitialHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
html,body,#map { width:100%; height:100%; background:#0f172a; }
.tl {
  background:var(--c,#16a34a); border:2px solid #fff; border-radius:8px;
  padding:3px 8px; color:#fff; font-size:11px; font-weight:700;
  font-family:-apple-system,sans-serif; white-space:nowrap;
  box-shadow:0 2px 8px rgba(0,0,0,0.6); cursor:pointer; position:absolute;
}
.ld {
  position:absolute; top:-3px; right:-3px; width:8px; height:8px;
  border-radius:50%; background:#34D399; border:1.5px solid #fff;
}
.gm-style .gm-style-iw-c { border-radius:12px !important; }
</style>
</head>
<body>
<div id="map"></div>
<script>
var _map = null;
var _info = null;
var _markers = {};   /* userId → { ov, el, curLat, curLng, animId } */
var _boundsSet = false;

/* ── ease-in-out quadratic ── */
function ease(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/* ── animate an existing marker entry to (targetLat, targetLng) ── */
function animateTo(entry, targetLat, targetLng) {
  if (entry.animId) { cancelAnimationFrame(entry.animId); entry.animId = null; }
  var dLat = Math.abs(entry.curLat - targetLat);
  var dLng = Math.abs(entry.curLng - targetLng);
  if (dLat < 0.000001 && dLng < 0.000001) return;

  var startLat = entry.curLat, startLng = entry.curLng;
  var t0 = performance.now(), D = 1000;

  function step(now) {
    var t = Math.min((now - t0) / D, 1);
    var e = ease(t);
    entry.curLat = startLat + (targetLat - startLat) * e;
    entry.curLng = startLng + (targetLng - startLng) * e;
    if (entry.ov && entry.ov.getProjection) {
      try { entry.ov.draw(); } catch(ex) {}
    }
    if (t < 1) {
      entry.animId = requestAnimationFrame(step);
    } else {
      entry.animId = null;
    }
  }
  entry.animId = requestAnimationFrame(step);
}

/* ── create a brand-new overlay for a marker datum ── */
function createMarker(data) {
  var el = document.createElement('div');
  el.className = 'tl';
  el.style.setProperty('--c', data.color);

  var labelSpan = document.createElement('span');
  labelSpan.className = 'lbl';
  labelSpan.textContent = data.label;
  el.appendChild(labelSpan);

  if (data.fresh) {
    var dot = document.createElement('span');
    dot.className = 'ld';
    el.appendChild(dot);
  }

  var entry = { el: el, curLat: data.lat, curLng: data.lng, animId: null, ov: null };

  var Ov = function() { google.maps.OverlayView.call(this); };
  Ov.prototype = Object.create(google.maps.OverlayView.prototype);
  Ov.prototype.constructor = Ov;

  Ov.prototype.onAdd = function() {
    var pane = this.getPanes().overlayMouseTarget;
    pane.appendChild(el);
    el.addEventListener('click', function() {
      _info.setContent(
        '<div style="font-family:-apple-system,sans-serif;padding:2px 0">' +
        '<b style="font-size:14px;color:#1e293b">' + data.userName + '</b><br>' +
        '<span style="font-size:12px;color:#64748b">' + data.area + '</span><br>' +
        '<span style="font-size:11px;color:' + data.color + '">' +
        (data.fresh ? 'Active' : 'Stale') + ' \u00b7 ' + data.mins + 'm ago</span></div>'
      );
      _info.setPosition(new google.maps.LatLng(entry.curLat, entry.curLng));
      _info.open(_map);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ userId: data.userId }));
      }
    });
  };

  Ov.prototype.draw = function() {
    var proj = this.getProjection();
    if (!proj) return;
    var p = proj.fromLatLngToDivPixel(new google.maps.LatLng(entry.curLat, entry.curLng));
    if (!p) return;
    el.style.left = (p.x - el.offsetWidth  / 2) + 'px';
    el.style.top  = (p.y - el.offsetHeight / 2) + 'px';
  };

  Ov.prototype.onRemove = function() {
    if (el.parentNode) el.parentNode.removeChild(el);
  };

  var ov = new Ov();
  ov.setMap(_map);
  entry.ov = ov;
  _markers[String(data.userId)] = entry;
}

/* ── called from React Native via injectJavaScript ── */
function updateMarkers(markers) {
  var seen = {};

  markers.forEach(function(data) {
    seen[String(data.userId)] = true;
    var entry = _markers[String(data.userId)];
    if (entry) {
      /* update appearance */
      entry.el.style.setProperty('--c', data.color);
      var lbl = entry.el.querySelector('.lbl');
      if (lbl) lbl.textContent = data.label;
      var dot = entry.el.querySelector('.ld');
      if (data.fresh && !dot) {
        var d = document.createElement('span');
        d.className = 'ld';
        entry.el.appendChild(d);
      } else if (!data.fresh && dot) {
        dot.remove();
      }
      /* animate to new position */
      animateTo(entry, data.lat, data.lng);
    } else {
      createMarker(data);
    }
  });

  /* remove departed markers */
  Object.keys(_markers).forEach(function(uid) {
    if (!seen[uid]) {
      var entry = _markers[uid];
      if (entry.animId) cancelAnimationFrame(entry.animId);
      entry.ov.setMap(null);
      delete _markers[uid];
    }
  });

  /* fit bounds once when first markers arrive */
  if (!_boundsSet && markers.length > 0) {
    _boundsSet = true;
    var b = new google.maps.LatLngBounds();
    markers.forEach(function(m) { b.extend(new google.maps.LatLng(m.lat, m.lng)); });
    if (markers.length > 1) {
      _map.fitBounds(b, { padding: 40 });
      google.maps.event.addListenerOnce(_map, 'bounds_changed', function() {
        if (_map.getZoom() > 14) _map.setZoom(14);
      });
    } else {
      _map.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
      _map.setZoom(14);
    }
  }
}

window.updateMarkers = updateMarkers;

function initMap() {
  _map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: ${MAKKAH_LAT}, lng: ${MAKKAH_LNG} },
    zoom: 11,
    mapTypeId: 'satellite',
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: [
      { featureType: 'all', elementType: 'labels.text.fill',   stylers: [{ color: '#ffffff' }] },
      { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }, { weight: 2 }] }
    ]
  });
  _info = new google.maps.InfoWindow();
  /* signal readiness to React Native */
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
  }
}

window.initMap = initMap;
</script>
<script async src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap"></script>
</body>
</html>`;
}

export default function MapViewContainer({ locations, onMarkerPress }: Props) {
  const webviewRef   = useRef<WebView>(null);
  const locRef       = useRef(locations);
  locRef.current     = locations;
  const readyRef     = useRef(false);
  const pendingRef   = useRef<MarkerData[] | null>(null);

  /* Build the shell HTML exactly once — never rebuild it */
  const initialHtml = useMemo(() => buildInitialHtml(), []);

  /* When map signals ready, flush any pending marker update */
  const onMessage = useCallback((e: WebViewMessageEvent) => {
    try {
      const payload = JSON.parse(e.nativeEvent.data) as { type?: string; userId?: number };
      if (payload.type === "mapReady") {
        readyRef.current = true;
        if (pendingRef.current !== null) {
          const js = `updateMarkers(${JSON.stringify(pendingRef.current)}); true;`;
          webviewRef.current?.injectJavaScript(js);
          pendingRef.current = null;
        }
        return;
      }
      /* marker tap */
      if (payload.userId != null) {
        const loc = locRef.current.find(l => l.userId === payload.userId);
        if (loc) onMarkerPress(loc);
      }
    } catch {}
  }, [onMarkerPress]);

  /* Inject marker updates whenever locations change */
  useEffect(() => {
    const data = buildMarkerData(locations);
    if (!readyRef.current) {
      pendingRef.current = data;
      return;
    }
    const js = `updateMarkers(${JSON.stringify(data)}); true;`;
    webviewRef.current?.injectJavaScript(js);
  }, [locations]);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <WebView
        ref={webviewRef}
        source={{ html: initialHtml }}
        style={styles.webview}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mixedContentMode="always"
        originWhitelist={["*"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webview: { flex: 1, backgroundColor: "#0f172a" },
});
