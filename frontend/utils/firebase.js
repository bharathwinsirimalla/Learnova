// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginlearnnova.firebaseapp.com",
  projectId: "loginlearnnova",
  storageBucket: "loginlearnnova.firebasestorage.app",
  messagingSenderId: "1093620083308",
  appId: "1:1093620083308:web:1d7deba496b235ba364649"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }
