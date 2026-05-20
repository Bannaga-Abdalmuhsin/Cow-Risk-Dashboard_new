import admin from "firebase-admin";
import { logger } from "./logger.js";

let _app: admin.app.App | null = null;

function getApp(): admin.app.App {
  if (_app) return _app;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");

  const cert = JSON.parse(raw) as admin.ServiceAccount;
  _app = admin.initializeApp({ credential: admin.credential.cert(cert) });
  logger.info({ projectId: cert.projectId }, "Firebase Admin SDK initialised");
  return _app;
}

export async function sendFcmNotification(
  token: string,
  title: string,
  body: string,
): Promise<void> {
  const app = getApp();
  await app.messaging().send({
    token,
    notification: { title, body },
    android: {
      priority: "high",
      notification: { sound: "default", channelId: "aces-tasks" },
    },
  });
}
