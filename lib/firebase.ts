import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCfxJGh9mWLapFHEPupE8IGod3t-4OglM8",
  authDomain: "gdd-ai-bd1a3.firebaseapp.com",
  projectId: "gdd-ai-bd1a3",
  storageBucket: "gdd-ai-bd1a3.firebasestorage.app",
  messagingSenderId: "296452534021",
  appId: "1:296452534021:web:ccea35ff543ff953b4116c",
  measurementId: "G-MSK50WWQWX"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };