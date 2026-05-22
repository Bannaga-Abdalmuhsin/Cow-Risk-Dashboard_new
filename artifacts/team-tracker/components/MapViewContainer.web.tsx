/**
 * Web Google Maps container with persistent overlays and smooth 1 s interpolation.
 *
 * Architecture:
 *  - Overlays are created once per technician and reused across renders.
 *  - When a technician's location changes, animateTo() uses requestAnimationFrame
 *    with an ease-in-out curve (1 000 ms) to move the overlay's DOM element.
 *  - draw() reads entry.curLat/curLng so animations are reflected immediately.
 *  - Bounds are fitted once on first render; subsequent updates do not re-fit.
 */
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
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

/* eslint-disable @typescript-eslint/no-explicit-any */

interface OverlayEntry {
  ov:        any;
  el:        HTMLDivElement;
  curLat:    number;
  curLng:    number;
  animId?:   number;
}

let _scriptPromise: Promise<void> | null = null;

function loadGoogleMapsApi(): Promise<void> {
  if (_scriptPromise) return _scriptPromise;
  const w = window as unknown as Record<string, unknown>;
  if ((w["google"] as Record<string, unknown> | undefined)?.["maps"]) {
    _scriptPromise = Promise.resolve();
    return _scriptPromise;
  }
  _scriptPromise = new Promise<void>(resolve => {
    const script = document.createElement("script");
    script.src   = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
  return _scriptPromise;
}

/** ease-in-out quadratic */
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function MapViewContainer({ locations, onMarkerPress }: Props) {
  const containerRef  = useRef<HTMLDivElement | null>(null);
  const mapRef        = useRef<any>(null);
  const infoWinRef    = useRef<any>(null);
  const overlayMapRef = useRef<Map<number, OverlayEntry>>(new Map());
  const firstFitRef   = useRef(true);
  const onPressRef    = useRef(onMarkerPress);
  onPressRef.current  = onMarkerPress;
  const locsRef       = useRef(locations);
  locsRef.current     = locations;

  /* ── initialise map once ────────────────────────────────────────────────── */
  useEffect(() => {
    loadGoogleMapsApi().then(() => {
      if (!containerRef.current || mapRef.current) return;
      const gm = (window as any).google.maps;
      mapRef.current = new gm.Map(containerRef.current, {
        center: { lat: MAKKAH_LAT, lng: MAKKAH_LNG },
        zoom:   11,
        mapTypeId:        "satellite",
        disableDefaultUI: false,
        zoomControl:      true,
        mapTypeControl:   false,
        streetViewControl:false,
        fullscreenControl:false,
        styles: [
          { featureType: "all", elementType: "labels.text.fill",   stylers: [{ color: "#ffffff" }] },
          { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#000000" }, { weight: 2 }] },
        ],
      });
      infoWinRef.current = new gm.InfoWindow();
      updateMarkers(gm, locsRef.current);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── update markers whenever locations prop changes ─────────────────────── */
  useEffect(() => {
    if (!mapRef.current) return;
    const gm = (window as any).google?.maps;
    if (!gm) return;
    updateMarkers(gm, locations);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  /* ── helpers ────────────────────────────────────────────────────────────── */

  function animateTo(entry: OverlayEntry, targetLat: number, targetLng: number): void {
    if (entry.animId) { cancelAnimationFrame(entry.animId); entry.animId = undefined; }
    const dLat = Math.abs(entry.curLat - targetLat);
    const dLng = Math.abs(entry.curLng - targetLng);
    if (dLat < 1e-7 && dLng < 1e-7) return;

    const startLat = entry.curLat, startLng = entry.curLng;
    const t0 = performance.now(), DURATION = 1000;

    const step = (now: number) => {
      const t = Math.min((now - t0) / DURATION, 1);
      const e = easeInOut(t);
      entry.curLat = startLat + (targetLat - startLat) * e;
      entry.curLng = startLng + (targetLng - startLng) * e;
      try { entry.ov.draw(); } catch {}
      if (t < 1) {
        entry.animId = requestAnimationFrame(step);
      } else {
        entry.animId = undefined;
      }
    };
    entry.animId = requestAnimationFrame(step);
  }

  function createOverlay(gm: any, map: any, loc: TechLocationWithUser): OverlayEntry {
    const mins  = minutesAgo(loc.updatedAt);
    const fresh = mins < 10;
    const color = fresh ? "#16a34a" : "#dc2626";
    const label = loc.userName.split(" ")[0];

    const el = document.createElement("div");
    el.style.cssText = [
      `background:${color}`, "border:2px solid #fff", "border-radius:8px",
      "padding:3px 8px", "color:#fff", "font-size:11px", "font-weight:700",
      "font-family:-apple-system,sans-serif", "white-space:nowrap",
      "box-shadow:0 2px 8px rgba(0,0,0,0.5)", "cursor:pointer", "position:absolute",
    ].join(";");

    const labelSpan = document.createElement("span");
    labelSpan.className = "lbl";
    labelSpan.textContent = label;
    el.appendChild(labelSpan);

    if (fresh) {
      const dot = document.createElement("span");
      dot.style.cssText = [
        "position:absolute", "top:-3px", "right:-3px",
        "width:7px", "height:7px", "border-radius:50%",
        "background:#34D399", "border:1.5px solid #fff",
      ].join(";");
      dot.className = "ld";
      el.appendChild(dot);
    }

    const entry: OverlayEntry = { el, curLat: loc.lat, curLng: loc.lng, ov: null };

    const OvBase = gm.OverlayView;
    function Ov(this: any) { OvBase.call(this); }
    Ov.prototype             = Object.create(OvBase.prototype);
    Ov.prototype.constructor = Ov;

    Ov.prototype.onAdd = function(this: any) {
      this.getPanes().overlayMouseTarget.appendChild(el);
      el.addEventListener("click", () => {
        const currentLoc = locsRef.current.find(l => l.userId === loc.userId) ?? loc;
        const cm  = minutesAgo(currentLoc.updatedAt);
        const cf  = cm < 10;
        const cc  = cf ? "#16a34a" : "#dc2626";
        infoWinRef.current?.setContent(
          `<div style="font-family:-apple-system,sans-serif;padding:2px 0">` +
          `<b style="font-size:14px;color:#1e293b">${currentLoc.userName}</b><br>` +
          `<span style="font-size:12px;color:#64748b">${currentLoc.area ?? "—"}</span><br>` +
          `<span style="font-size:11px;color:${cc}">${cf ? "Active" : "Stale"} · ${cm}m ago</span></div>`
        );
        infoWinRef.current?.setPosition(new gm.LatLng(entry.curLat, entry.curLng));
        infoWinRef.current?.open(mapRef.current);
        onPressRef.current(currentLoc);
      });
    };

    Ov.prototype.draw = function() {
      const proj = (this as any).getProjection?.();
      if (!proj) return;
      const p = proj.fromLatLngToDivPixel(new gm.LatLng(entry.curLat, entry.curLng));
      if (!p) return;
      el.style.left = `${p.x - el.offsetWidth  / 2}px`;
      el.style.top  = `${p.y - el.offsetHeight / 2}px`;
    };

    Ov.prototype.onRemove = function() {
      if (el.parentNode) el.parentNode.removeChild(el);
    };

    const ov = new (Ov as any)();
    ov.setMap(map);
    entry.ov = ov;
    return entry;
  }

  function updateMarkerAppearance(entry: OverlayEntry, loc: TechLocationWithUser): void {
    const mins  = minutesAgo(loc.updatedAt);
    const fresh = mins < 10;
    const color = fresh ? "#16a34a" : "#dc2626";
    const label = loc.userName.split(" ")[0];
    entry.el.style.background = color;
    const lbl = entry.el.querySelector(".lbl") as HTMLElement | null;
    if (lbl) lbl.textContent = label;
    const dot = entry.el.querySelector(".ld") as HTMLElement | null;
    if (fresh && !dot) {
      const d = document.createElement("span");
      d.style.cssText = [
        "position:absolute", "top:-3px", "right:-3px",
        "width:7px", "height:7px", "border-radius:50%",
        "background:#34D399", "border:1.5px solid #fff",
      ].join(";");
      d.className = "ld";
      entry.el.appendChild(d);
    } else if (!fresh && dot) {
      dot.remove();
    }
  }

  function updateMarkers(gm: any, locs: TechLocationWithUser[]): void {
    const map   = mapRef.current as any;
    const locById = new Map(locs.map(l => [l.userId, l]));

    /* remove departed techs */
    for (const [userId, entry] of overlayMapRef.current) {
      if (!locById.has(userId)) {
        if (entry.animId) cancelAnimationFrame(entry.animId);
        entry.ov.setMap(null);
        overlayMapRef.current.delete(userId);
      }
    }

    /* update existing or create new overlays */
    for (const loc of locs) {
      const entry = overlayMapRef.current.get(loc.userId);
      if (entry) {
        updateMarkerAppearance(entry, loc);
        animateTo(entry, loc.lat, loc.lng);
      } else {
        const newEntry = createOverlay(gm, map, loc);
        overlayMapRef.current.set(loc.userId, newEntry);
      }
    }

    /* fit bounds once on first render with data */
    if (firstFitRef.current && locs.length > 0) {
      firstFitRef.current = false;
      const bounds = new gm.LatLngBounds();
      for (const loc of locs) bounds.extend({ lat: loc.lat, lng: loc.lng });
      if (locs.length > 1) {
        map.fitBounds(bounds);
        gm.event.addListenerOnce(map, "bounds_changed", () => {
          if (map.getZoom() > 14) map.setZoom(14);
        });
      } else {
        map.setCenter({ lat: locs[0].lat, lng: locs[0].lng });
        map.setZoom(14);
      }
    }
  }

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        style={{ width: "100%", height: "100%" } as React.CSSProperties}
      />
    </View>
  );
}

const _styles = StyleSheet.create({ placeholder: { flex: 1 } });
void _styles;
