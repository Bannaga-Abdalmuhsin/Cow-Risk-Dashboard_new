import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { type TechLocationWithUser } from "@/lib/api";

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

function buildHtml(
  locations: TechLocationWithUser[],
  onDutyColor: string,
  offDutyColor: string,
): string {
  const markers = locations.map(loc => {
    const mins  = minutesAgo(loc.updatedAt);
    const fresh = mins < 10;
    const color = fresh ? "#16a34a" : "#dc2626";
    const label = loc.userName.split(" ")[0];
    return { lat: loc.lat, lng: loc.lng, color, label, mins, fresh, userId: loc.userId, area: loc.area ?? "—", userName: loc.userName };
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #map { width: 100%; height: 100%; background: #0f172a; }
  .marker-pin {
    background: var(--c);
    border: 2px solid #fff;
    border-radius: 8px;
    padding: 3px 7px;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    font-family: -apple-system, sans-serif;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    cursor: pointer;
    position: relative;
    text-align: center;
  }
  .live-dot {
    position: absolute;
    top: -3px;
    right: -3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #34D399;
    border: 1.5px solid #fff;
  }
  .leaflet-popup-content-wrapper {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    color: #e2e8f0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }
  .leaflet-popup-tip { background: #1e293b; }
  .leaflet-popup-content { margin: 12px 14px; }
  .popup-name { font-size: 14px; font-weight: 700; color: #f1f5f9; }
  .popup-area { font-size: 12px; color: #94a3b8; margin-top: 2px; }
  .popup-time { font-size: 11px; margin-top: 4px; }
</style>
</head>
<body>
<div id="map"></div>
<script>
var map = L.map('map', {
  center: [${MAKKAH_LAT}, ${MAKKAH_LNG}],
  zoom: 11,
  zoomControl: true,
  attributionControl: false
});

L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { maxZoom: 19, attribution: 'Tiles &copy; Esri' }
).addTo(map);

var markers = ${JSON.stringify(markers)};

markers.forEach(function(m) {
  var icon = L.divIcon({
    className: '',
    html: '<div class="marker-pin" style="--c:' + m.color + '">' +
          m.label +
          (m.fresh ? '<span class="live-dot"></span>' : '') +
          '</div>',
    iconAnchor: [0, 0],
    popupAnchor: [0, -4]
  });

  var marker = L.marker([m.lat, m.lng], { icon: icon }).addTo(map);

  var timeLabel = m.fresh ? 'Active &bull; ' + m.mins + 'm ago' : 'Stale &bull; ' + m.mins + 'm ago';
  marker.bindPopup(
    '<div class="popup-name">' + m.userName + '</div>' +
    '<div class="popup-area">' + m.area + '</div>' +
    '<div class="popup-time" style="color:' + m.color + '">' + timeLabel + '</div>'
  );

  marker.on('click', function() {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ userId: m.userId }));
    }
  });
});

if (markers.length > 0) {
  var lats = markers.map(function(m) { return m.lat; });
  var lngs = markers.map(function(m) { return m.lng; });
  var bounds = L.latLngBounds(
    [Math.min.apply(null, lats), Math.min.apply(null, lngs)],
    [Math.max.apply(null, lats), Math.max.apply(null, lngs)]
  );
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
}
</script>
</body>
</html>`;
}

export default function MapViewContainer({ locations, onDutyColor, offDutyColor, onMarkerPress }: Props) {
  const locRef   = useRef(locations);
  locRef.current = locations;

  const html = buildHtml(locations, onDutyColor, offDutyColor);

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
