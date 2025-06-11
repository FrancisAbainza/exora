// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "exora-platform.firebaseapp.com",
  projectId: "exora-platform",
  storageBucket: "exora-platform.firebasestorage.app",
  messagingSenderId: "264901243705",
  appId: "1:264901243705:web:3a4687985dc4022dd6eee8",
  measurementId: "G-EV0MEDWSRE"
};

// Initialize Firebase
const currentApps = getApps();
let auth: Auth
let storage: FirebaseStorage

if (!currentApps.length) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
} else {
  const app = currentApps[0];
  auth = getAuth(app);
  storage = getStorage(app);
}

export {auth, storage};