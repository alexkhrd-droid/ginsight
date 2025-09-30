import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js';

// Firebase configuration (новые настройки)
const firebaseConfig = {
  apiKey: "AIzaSyCnTbwjQtFwf3oJWFv_YtMAXeB-yS9GKNY",
  authDomain: "ginsight-5befe.firebaseapp.com",
  projectId: "ginsight-5befe",
  storageBucket: "ginsight-5befe.firebasestorage.app",
  messagingSenderId: "664577526903",
  appId: "1:664577526903:web:e6cae5721dad683f490a72",
  measurementId: "G-JTFHWBPF61"
};

// Initialize Firebase
let firebaseApp;
let analytics;

try {
  firebaseApp = initializeApp(firebaseConfig);
  analytics = getAnalytics(firebaseApp);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', {
    message: error.message,
    code: error.code,
    details: error.details || 'No details available'
  });
}

// Export for use in other modules
export { firebaseApp, analytics };

