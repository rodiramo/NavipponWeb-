import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA59b0-Vx4iZvfDy-NGH9dWLoffckVJCP4",
    authDomain: "eguzman-firebase.firebaseapp.com",
    projectId: "eguzman-firebase",
    storageBucket: "eguzman-firebase.appspot.com",
    messagingSenderId: "1025704749439",
    appId: "1:1025704749439:web:e44b4e25e4d5e38b50524a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);