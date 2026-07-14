import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDsV-bASHFqZP-q-g9o_VE-PeV1y9Innbg",
  authDomain: "yourtube-3cc9f.firebaseapp.com",
  projectId: "yourtube-3cc9f",
  storageBucket: "yourtube-3cc9f.firebasestorage.app",
  messagingSenderId: "779999841752",
  appId: "1:779999841752:web:15d7e8bd52930b1c5bb6ad",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); 

export default app;