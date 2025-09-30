import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1Ju-LnljEjtshj2WggwHbAZaccmQK-IY",
  authDomain: "gvins-c3767.firebaseapp.com",
  projectId: "gvins-c3767",
  storageBucket: "gvins-c3767.firebasestorage.app",
  messagingSenderId: "1050780679115",
  appId: "1:1050780679115:web:59426955ffb7c9a124944e",
  measurementId: "G-L57W36XTLZ"
};

// Initialize Firebase
let firebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', {
    message: error.message,
    code: error.code,
    details: error.details || 'No details available'
  });
}

// Export for use in other modules
export { firebaseApp };
