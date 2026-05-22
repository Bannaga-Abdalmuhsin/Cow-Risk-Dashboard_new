import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
  return _scriptPromise;
}

export default function MapViewContainer({ locations, onMarkerPress }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef       = useRef<unknown>(null);
  const overlaysRef  = useRef<unknown[]>([]);
  const onPressRef   = useRef(onMarkerPress);
  onPressRef.current = onMarkerPress;
  const locsRef      = useRef(locations);
  locsRef.current    = locations;

  useEffect(() => {
    loadGoogleMapsApi().then(() => {
      if (!containerRef.current || mapRef.current) return;
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const gm = (window as any).google.maps;
      mapRef.current = new gm.Map(containerRef.current, {
        center: { lat: MAKKAH_LAT, lng: MAKKAH_LNG },
        zoom: 11,
        mapTypeId: "satellite",
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: "all", elementType: "labels.text.fill",   stylers: [{ color: "#ffffff" }] },
          { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#000000" }, { weight: 2 }] },
        ],
      });
      renderMarkers(gm, locsRef.current);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const gm = (window as any).google?.maps;
    if (!gm) return;
    renderMarkers(gm, locations);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  function renderMarkers(gm: any, locs: TechLocationWithUser[]) {
    (overlaysRef.current as any[]).forEach(o => o.setMap(null));
    overlaysRef.current = [];

    const bounds  = new gm.LatLngBounds();
    const infoWin = new gm.InfoWindow();

    locs.forEach(loc => {
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
      el.textContent = label;

      if (fresh) {
        const dot = document.createElement("span");
        dot.style.cssText = [
          "position:absolute", "top:-3px", "right:-3px",
          "width:7px", "height:7px", "border-radius:50%",
          "background:#34D399", "border:1.5px solid #fff",
        ].join(";");
        el.appendChild(dot);
      }

      const ll = new gm.LatLng(loc.lat, loc.lng);

      const OvBase = gm.OverlayView;
      function Ov(this: any) { OvBase.call(this); }
      Ov.prototype             = Object.create(OvBase.prototype);
      Ov.prototype.constructor = Ov;
      Ov.prototype.onAdd       = function(this: any) {
        this.getPanes().overlayMouseTarget.appendChild(el);
        el.addEventListener("click", () => {
          infoWin.setContent(
            `<div style="font-family:-apple-system,sans-serif;padding:2px 0">` +
            `<b style="font-size:14px;color:#1e293b">${loc.userName}</b><br>` +
            `<span style="font-size:12px;color:#64748b">${loc.area ?? "—"}</span><br>` +
            `<span style="font-size:11px;color:${color}">${fresh ? "Active" : "Stale"} · ${mins}m ago</span></div>`
          );
          infoWin.setPosition(ll);
          infoWin.open(mapRef.current);
          onPressRef.current(loc);
        });
      };
      Ov.prototype.draw = function(this: any) {
        const p = this.getProjection().fromLatLngToDivPixel(ll);
        el.style.left = `${p.x - el.offsetWidth  / 2}px`;
        el.style.top  = `${p.y - el.offsetHeight / 2}px`;
      };
      Ov.prototype.onRemove = function() {
        if (el.parentNode) el.parentNode.removeChild(el);
      };

      const ov = new (Ov as any)();
      ov.setMap(mapRef.current);
      overlaysRef.current.push(ov);
      bounds.extend(ll);
    });

    if (locs.length > 1) {
      (mapRef.current as any).fitBounds(bounds);
      gm.event.addListenerOnce(mapRef.current, "bounds_changed", () => {
        if ((mapRef.current as any).getZoom() > 14) (mapRef.current as any).setZoom(14);
      });
    } else if (locs.length === 1) {
      (mapRef.current as any).setCenter({ lat: locs[0].lat, lng: locs[0].lng });
      (mapRef.current as any).setZoom(14);
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
