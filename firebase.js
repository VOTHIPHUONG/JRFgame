// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_i9NWCqb04Imfw4UW0BqLE4jvzOi0t-M",
    authDomain: "gamejrf-4423b.firebaseapp.com",
    projectId: "gamejrf-4423b",
    storageBucket: "gamejrf-4423b.appspot.com",
    messagingSenderId: "915828708458",
    appId: "1:915828708458:web:9b4f5350ae2f8c41f5a613",
    measurementId: "G-XJV3ZFT98F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

// Your game logic here
