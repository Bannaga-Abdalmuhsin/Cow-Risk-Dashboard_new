const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ?? "";

export interface RouteResult {
  polyline:    { lat: number; lng: number }[];
  distanceKm:  number;
  etaMinutes:  number;
}

function decodePolyline(encoded: string): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let shift = 0, result = 0, b: number;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);
    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

export async function getDirectionsRoute(
  originLat: number, originLng: number,
  destLat:   number, destLng:   number,
): Promise<RouteResult | null> {
  if (!GOOGLE_API_KEY) return null;
  try {
    const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
    url.searchParams.set("origin",      `${originLat},${originLng}`);
    url.searchParams.set("destination", `${destLat},${destLng}`);
    url.searchParams.set("mode",        "driving");
    url.searchParams.set("key",         GOOGLE_API_KEY);

    const resp = await fetch(url.toString());
    if (!resp.ok) return null;
    const data = await resp.json() as {
      status: string;
      routes: {
        overview_polyline: { points: string };
        legs: { distance: { value: number }; duration: { value: number } }[];
      }[];
    };
    if (data.status !== "OK" || data.routes.length === 0) return null;

    const route   = data.routes[0];
    const leg     = route.legs[0];
    const distKm  = leg.distance.value / 1000;
    const etaMins = Math.ceil(leg.duration.value / 60);
    const polyline = decodePolyline(route.overview_polyline.points);

    return { polyline, distanceKm: distKm, etaMinutes: etaMins };
  } catch {
    return null;
  }
}
