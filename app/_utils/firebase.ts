import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any;

function initFirebaseApp() {
  const existingApp = getApps().find((app) => app.name === '[DEFAULT]');
  if (!existingApp) {
    app = initializeApp(firebaseConfig);
  } else {
    app = existingApp;
    console.log('Firebase app already initialized');
  }
  return app;
}

app = initFirebaseApp();

const firebaseAuth = getAuth(app);
const database = getDatabase(app);

export { app, firebaseAuth, database };