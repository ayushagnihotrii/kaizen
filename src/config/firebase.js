// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyApVP0bYJw1npgd1efOCe1GEfPeoALWiiA",
    authDomain: "to-do-list-8c479.firebaseapp.com",
    projectId: "to-do-list-8c479",
    storageBucket: "to-do-list-8c479.firebasestorage.app",
    messagingSenderId: "55749804201",
    appId: "1:55749804201:web:2efd01721e710f0c6129b8",
    measurementId: "G-BSXF5JKF1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
