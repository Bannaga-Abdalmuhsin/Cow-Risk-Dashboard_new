import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK_NAME = "aces-background-location";

const AUTH_KEY = "aces_team_auth";

function getApiBaseUrl(): string {
  const env = process.env.EXPO_PUBLIC_API_URL;
  if (env) return env;
  return "https://4a3b2adb-54bb-4c8a-a7b7-fee922024ba6-00-25arfy9uinng9.picard.replit.dev";
}

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data, error }: TaskManager.TaskManagerTaskBody<{ locations: Location.LocationObject[] }>) => {
    if (error) return;
    const locations = (data as { locations: Location.LocationObject[] })?.locations;
    if (!locations?.length) return;

    const { latitude, longitude, speed, heading, accuracy } = locations[0].coords;

    /* ── 25 m accuracy filter ── discard low-quality readings ── */
    if (accuracy != null && accuracy > 25) return;

    try {
      const raw = await AsyncStorage.getItem(AUTH_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { token?: string };
      const token = parsed?.token;
      if (!token) return;

      await fetch(`${getApiBaseUrl()}/api/team/location`, {
        method:  "PUT",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          lat:      latitude,
          lng:      longitude,
          isOnDuty: true,
          speed:    speed    != null ? Math.round(speed * 3.6 * 10) / 10 : null,
          heading:  heading  ?? null,
          accuracy: accuracy ?? null,
        }),
      });
    } catch {}
  },
);

export async function startBackgroundLocationTask(): Promise<boolean> {
  try {
    const { status: fg } = await Location.requestForegroundPermissionsAsync();
    if (fg !== "granted") return false;

    const { status: bg } = await Location.requestBackgroundPermissionsAsync();
    if (bg !== "granted") return false;

    const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (!alreadyRunning) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy:                   Location.Accuracy.BestForNavigation,
        timeInterval:               10_000,
        distanceInterval:           1,           // 1 m minimum displacement
        pausesUpdatesAutomatically: false,
        activityType:               Location.ActivityType.OtherNavigation,
        foregroundService: {
          notificationTitle: "ACES Field Tracker",
          notificationBody:  "Sharing location during duty hours",
          notificationColor: "#8B1A1A",
        },
        showsBackgroundLocationIndicator: true,
      });
    }
    return true;
  } catch {
    return false;
  }
}

export async function stopBackgroundLocationTask(): Promise<void> {
  try {
    const running = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (running) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  } catch {}
}

export async function isBackgroundLocationRunning(): Promise<boolean> {
  try {
    return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  } catch {
    return false;
  }
}
