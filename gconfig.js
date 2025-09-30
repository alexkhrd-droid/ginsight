import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js';

 
const firebaseConfig = {
  apiKey: "AIzaSyCD11Bm8Z38U3lApRTgbSw-m-9tV4boaqM",
  authDomain: "new-blog-ea837.firebaseapp.com",
  projectId: "new-blog-ea837",
  storageBucket: "new-blog-ea837.firebasestorage.app",
  messagingSenderId: "833721509241",
  appId: "1:833721509241:web:3a1be95a13170236c6bba8"
};

 
let firebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig);
  console.log('Firebase успешно инициализирован');
} catch (error) {
  console.error('Ошибка инициализации Firebase:', error.message, error);
  throw error;
}

 
export { firebaseApp };
