import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0eZfCKjT8MuykV7GJtw-rio7QnNpLJ40",
  authDomain: "joblink-8d820.firebaseapp.com",
  projectId: "joblink-8d820",
  storageBucket: "joblink-8d820.firebasestorage.app",
  messagingSenderId: "821320100593",
  appId: "1:821320100593:web:13606aa0607c96c5911750"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
