import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { type TechLocationWithUser } from "@/lib/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyBimHwfRUw7XWVE4QjFKUbIjm6PaPsEX4M";
const MAKKAH_LAT = 21.38;
const MAKKAH_LNG = 39.93;

interface Props {
  locations: TechLocationWithUser[];
  onDutyColor: string;
  offDutyColor: string;
  onMarkerPress: (loc: TechLocationWithUser) => void;
}

function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

function buildHtml(locations: TechLocationWithUser[]): string {
  const markers = locations.map(loc => {
    const mins  = minutesAgo(loc.updatedAt);
    const fresh = mins < 10;
    return {
      lat: loc.lat, lng: loc.lng,
      color: fresh ? "#16a34a" : "#dc2626",
      label: loc.userName.split(" ")[0],
      mins, fresh,
      userId: loc.userId,
      area: loc.area ?? "—",
      userName: loc.userName,
    };
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
html,body,#map { width:100%; height:100%; background:#0f172a; }
.tl {
  background:var(--c); border:2px solid #fff; border-radius:8px;
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
var M = ${JSON.stringify(markers)};

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
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

  var info = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  M.forEach(function(m) {
    var el = document.createElement('div');
    el.className = 'tl';
    el.style.setProperty('--c', m.color);
    el.textContent = m.label;

    if (m.fresh) {
      var dot = document.createElement('span');
      dot.className = 'ld';
      el.appendChild(dot);
    }

    var ll = new google.maps.LatLng(m.lat, m.lng);

    var Ov = function() { google.maps.OverlayView.call(this); };
    Ov.prototype = Object.create(google.maps.OverlayView.prototype);
    Ov.prototype.constructor = Ov;
    Ov.prototype.onAdd = function() {
      var pane = this.getPanes().overlayMouseTarget;
      pane.appendChild(el);
      el.addEventListener('click', function() {
        info.setContent(
          '<div style="font-family:-apple-system,sans-serif;padding:2px 0">' +
          '<b style="font-size:14px;color:#1e293b">' + m.userName + '</b><br>' +
          '<span style="font-size:12px;color:#64748b">' + m.area + '</span><br>' +
          '<span style="font-size:11px;color:' + m.color + '">' +
          (m.fresh ? 'Active' : 'Stale') + ' \u00b7 ' + m.mins + 'm ago</span></div>'
        );
        info.setPosition(ll);
        info.open(map);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ userId: m.userId }));
        }
      });
    };
    Ov.prototype.draw = function() {
      var p = this.getProjection().fromLatLngToDivPixel(ll);
      el.style.left = (p.x - el.offsetWidth / 2) + 'px';
      el.style.top  = (p.y - el.offsetHeight / 2) + 'px';
    };
    Ov.prototype.onRemove = function() {
      if (el.parentNode) el.parentNode.removeChild(el);
    };

    var ov = new Ov();
    ov.setMap(map);
    bounds.extend(ll);
  });

  if (M.length > 1) {
    map.fitBounds(bounds, { padding: 40 });
    google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
      if (map.getZoom() > 14) map.setZoom(14);
    });
  } else if (M.length === 1) {
    map.setCenter({ lat: M[0].lat, lng: M[0].lng });
    map.setZoom(14);
  }
}

window.initMap = initMap;
</script>
<script async src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap"></script>
</body>
</html>`;
}

export default function MapViewContainer({ locations, onMarkerPress }: Props) {
  const locRef   = useRef(locations);
  locRef.current = locations;

  const html = buildHtml(locations);

  const onMessage = useCallback((e: WebViewMessageEvent) => {
    try {
      const { userId } = JSON.parse(e.nativeEvent.data) as { userId: number };
      const loc = locRef.current.find(l => l.userId === userId);
      if (loc) onMarkerPress(loc);
    } catch {}
  }, [onMarkerPress]);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <WebView
        source={{ html }}
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
