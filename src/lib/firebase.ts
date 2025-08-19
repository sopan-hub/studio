import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
    "projectId": "study-buddy-ai-5apv9",
    "appId": "1:1002430339361:web:6abcd5576201a16c018660",
    "storageBucket": "study-buddy-ai-5apv9.firebasestorage.app",
    "apiKey": "AIzaSyCe0pKL_PJGHw0UZfOy1_J9rMA7YIUnr9Y",
    "authDomain": "study-buddy-ai-5apv9.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": "1002430339361"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
