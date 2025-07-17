// lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, enableNetwork, disableNetwork } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCxydFfOVAV1vQpoa9cXWRkZ1ktB-t22bk",
  authDomain: "uninest-1f332.firebaseapp.com",
  projectId: "uninest-1f332",
  storageBucket: "uninest-1f332.appspot.com",
  messagingSenderId: "376438447334",
  appId: "1:376438447334:web:e5dcf8cdb750e71b5aaf27",
  measurementId: "G-WKWJX5M8H1"
};

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Network state management
export const enableFirebaseNetwork = () => enableNetwork(db);
export const disableFirebaseNetwork = () => disableNetwork(db); 