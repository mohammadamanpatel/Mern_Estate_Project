// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-1e7c6.firebaseapp.com",
  projectId: "mern-estate-1e7c6",
  storageBucket: "mern-estate-1e7c6.appspot.com",
  messagingSenderId: "876651159558",
  appId: "1:876651159558:web:055cce3f432886b1aba387"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);