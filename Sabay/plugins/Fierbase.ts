import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjs-LrDWTU5yTOVU3jhv6N4YkMRNvwK5o",
  authDomain: "sabay-stay.firebaseapp.com",
  databaseURL:
    "https://sabay-stay-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sabay-stay",
  storageBucket: "sabay-stay.firebasestorage.app",
  messagingSenderId: "1037173017258",
  appId: "1:1037173017258:web:5477dcdeca4aad4a541ed3",
  measurementId: "G-FS112MWJBG",
};

export default defineNuxtPlugin(() => {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  if (import.meta.client) {
    isSupported().then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    });
  }

  return {
    provide: {
      firebaseApp: app,
      auth,
      db,
    },
  };
});
