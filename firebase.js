import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB_i9NWCqb04Imfw4UW0BqLE4jvzOi0t-M",
  authDomain: "gamejrf-4423b.firebaseapp.com",
  projectId: "gamejrf-4423b",
  storageBucket: "gamejrf-4423b.appspot.com",
  messagingSenderId: "915828708458",
  appId: "1:915828708458:web:9b4f5350ae2f8c41f5a613",
  measurementId: "G-XJV3ZFT98F",
  databaseURL: "https://gamejrf-4423b-default-rtdb.firebaseio.com/" // Cần có URL của Realtime Database
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
