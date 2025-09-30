import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD11Bm8Z38U3lApRTgbSw-m-9tV4boaqM",
  authDomain: "new-blog-ea837.firebaseapp.com",
  projectId: "new-blog-ea837",
  storageBucket: "new-blog-ea837.firebasestorage.app",
  messagingSenderId: "833721509241",
  appId: "1:833721509241:web:3a1be95a13170236c6bba8"
};
// Initialize Firebase
let firebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig);
  console.log('Firebase successfully initialized');
} catch (error) {
  console.error('Firebase initialization error:', {
    message: error.message,
    code: error.code,
    details: error.details || 'No details'
  });
  throw error;
}
// Export the app
export { firebaseApp };
