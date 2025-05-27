// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBYQPm24JwVBZXLVSOxhZ-M-2x2Y3Splok",
    authDomain: "quranmemorizer-5e526.firebaseapp.com",
    projectId: "quranmemorizer-5e526",
    storageBucket: "quranmemorizer-5e526.firebasestorage.app",
    messagingSenderId: "119536293083",
    appId: "1:119536293083:web:0c64bb33c6ea42913d68fe",
    measurementId: "G-W7Q6VYG0YC"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
