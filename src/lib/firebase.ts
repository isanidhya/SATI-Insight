
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Updates a user's profile in Firestore. If the document doesn't exist, it will be created.
 * @param uid The user's ID.
 * @param data The data to update or set.
 */
export async function updateUserProfile(uid: string, data: Record<string, any>) {
  const userDocRef = doc(db, 'users', uid);
  // Use setDoc with merge:true to create the doc if it doesn't exist, or update it if it does.
  await setDoc(userDocRef, data, { merge: true });
}


export { app, auth, db };
