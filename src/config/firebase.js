// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDsYaOpRI7hESJI8ED4DzQwx_nd53BPxkQ",
  authDomain: "firbase-ims-connect.firebaseapp.com",
  projectId: "firbase-ims-connect",
  storageBucket: "firbase-ims-connect.firebasestorage.app",
  messagingSenderId: "995886486355",
  appId: "1:995886486355:web:6942daa777322621bfc7a6",
  measurementId: "G-VYF9QMTJRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);