// Tracks time spent near each destination, using the browser Geolocation API.
// State lives in localStorage so it survives reloads. When a destination
// accumulates >= 48h of presence within a 25 km radius, the app unlocks
// a "visited" achievement and (optionally) posts a browser notification.

import { destinations, type Destination } from "@/lib/destinations";

const STORAGE_KEY = "heri.location.v1";
const RADIUS_KM = 25;
const TWO_DAYS_S = 48 * 3600;
export const LOCATION_EVENT = "heri:location-changed";
export const LOCATION_VISIT_EVENT = "heri:destination-visited";

export type LocationState = {
  enabled: boolean;
  lastLat: number | null;
  lastLng: number | null;
  lastCity: string | null;
  updatedAt: number | null;
  seconds: Record<string, number>; // destination id -> accumulated seconds
  visited: Record<string, number>; // destination id -> unlock timestamp
  activeDestId: string | null;
};

const empty = (): LocationState => ({
  enabled: false,
  lastLat: null,
  lastLng: null,
  lastCity: null,
  updatedAt: null,
  seconds: {},
  visited: {},
  activeDestId: null,
});

export function readLocation(): LocationState {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    return { ...empty(), ...(JSON.parse(raw) as Partial<LocationState>) };
  } catch {
    return empty();
  }
}

function write(next: LocationState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(LOCATION_EVENT));
}

export function notificationsAllowed(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem("heri.notifications.enabled");
  return raw === null ? true : raw === "true";
}

export function setNotificationsAllowed(v: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("heri.notifications.enabled", String(v));
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function nearestDestination(lat: number, lng: number): Destination | null {
  let best: Destination | null = null;
  let bestKm = Infinity;
  for (const d of destinations) {
    const km = haversineKm({ lat, lng }, { lat: d.lat, lng: d.lng });
    if (km < bestKm) { bestKm = km; best = d; }
  }
  return bestKm <= RADIUS_KM ? best : null;
}

async function notify(title: string, body: string) {
  if (!notificationsAllowed()) return;
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  } catch { /* ignore */ }
}

let watchId: number | null = null;
let tickHandle: ReturnType<typeof setInterval> | null = null;

export async function enableLocationTracking(): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    return { ok: false, error: "Geolocation not supported on this device." };
  }
  try {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  } catch { /* ignore */ }

  const state = readLocation();
  state.enabled = true;
  write(state);

  const applyPos = (pos: GeolocationPosition) => {
    const s = readLocation();
    const now = Date.now();
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const nearest = nearestDestination(lat, lng);

    // accumulate time for the currently-active destination
    if (s.activeDestId && s.updatedAt) {
      const dt = Math.min(60, Math.round((now - s.updatedAt) / 1000));
      if (dt > 0) {
        s.seconds[s.activeDestId] = (s.seconds[s.activeDestId] ?? 0) + dt;
        if (!s.visited[s.activeDestId] && s.seconds[s.activeDestId] >= TWO_DAYS_S) {
          s.visited[s.activeDestId] = now;
          const d = destinations.find((x) => x.id === s.activeDestId);
          if (d) {
            void notify("🏆 Wings unlocked!", `You've spent 48h in ${d.name}. Achievement earned.`);
            window.dispatchEvent(new CustomEvent(LOCATION_VISIT_EVENT, { detail: d }));
          }
        }
      }
    }

    s.lastLat = lat; s.lastLng = lng; s.updatedAt = now;
    const nextActive = nearest?.id ?? null;
    if (nextActive !== s.activeDestId) {
      s.activeDestId = nextActive;
      if (nearest) {
        s.lastCity = `${nearest.name}, ${nearest.country}`;
        void notify("📍 Tracking started", `H.E.R.I is timing your stay in ${nearest.name}. Two full days unlocks a badge.`);
      }
    }
    write(s);
  };

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyPos(pos);
        if (watchId === null) {
          watchId = navigator.geolocation.watchPosition(applyPos, () => {}, {
            enableHighAccuracy: false,
            maximumAge: 60_000,
            timeout: 30_000,
          });
        }
        if (tickHandle === null) {
          tickHandle = setInterval(() => {
            navigator.geolocation.getCurrentPosition(applyPos, () => {}, { maximumAge: 60_000 });
          }, 60_000);
        }
        resolve({ ok: true });
      },
      (err) => resolve({ ok: false, error: err.message }),
      { enableHighAccuracy: false, timeout: 15_000 },
    );
  });
}

export function disableLocationTracking() {
  if (watchId !== null && "geolocation" in navigator) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  if (tickHandle !== null) {
    clearInterval(tickHandle);
    tickHandle = null;
  }
  const s = readLocation();
  s.enabled = false;
  s.activeDestId = null;
  write(s);
}

export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  const d = Math.floor(h / 24);
  const rh = h % 24;
  if (d > 0) return `${d}d ${rh}h`;
  return `${h}h ${m}m`;
}

export const TWO_DAYS_SECONDS = TWO_DAYS_S;
