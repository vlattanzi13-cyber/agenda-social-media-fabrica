import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDCGFZ8LxkmRSwFBhOEWf7_f-CK7IIcbVk",
  authDomain: "agenda-social-media-fabrica.firebaseapp.com",
  projectId: "agenda-social-media-fabrica",
  storageBucket: "agenda-social-media-fabrica.firebasestorage.app",
  messagingSenderId: "888957394146",
  appId: "1:888957394146:web:c3e7b6c3ea9a322bab92bb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
