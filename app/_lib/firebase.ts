import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuração do Firebase (substitua pelos seus valores reais)
const firebaseConfig = {
  // Suas configurações aqui
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;

if (process.env.NODE_ENV === "production") {
  // Inicializa o Firebase em produção
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} else {
  // Em desenvolvimento, verifica se já foi inicializado
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(global as any).firebaseApp) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).firebaseApp = initializeApp(firebaseConfig);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(global as any).firebaseDb) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).firebaseDb = getDatabase((global as any).firebaseApp);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app = (global as any).firebaseApp;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db = (global as any).firebaseDb;
}
export { app, db };