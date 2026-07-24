import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const cleanEnv = (val?: string) => (val ? val.replace(/['",\s]/g, "") : "");

const firebaseConfig = {
  apiKey: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.APIKEY,
  ),
  authDomain: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.AUTH_DOMAIN,
  ),
  projectId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.PROJECT_ID,
  ),
  storageBucket: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      process.env.STORAGE_BUCKET,
  ),
  messagingSenderId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      process.env.MESSAGING_SENDER_ID,
  ),
  appId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.APP_ID,
  ),
  measurementId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
      process.env.MEASUREMENT_ID,
  ),
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Suppress internal gRPC stream retry log noise when Firestore database is disabled/not yet created
try {
  setLogLevel("silent");
} catch {
  // Ignore if setLogLevel is not supported in environment
}

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
