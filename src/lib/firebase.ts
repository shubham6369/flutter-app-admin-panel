import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDrzK_cjVg2ph_eZMCF65IDF6QW5yoDLs",
  authDomain: "jee-neet-pulse-8cbe1.firebaseapp.com",
  projectId: "jee-neet-pulse-8cbe1",
  storageBucket: "jee-neet-pulse-8cbe1.firebasestorage.app",
  messagingSenderId: "1083735095322",
  appId: "1:1083735095322:web:2021dff7c06ab2458139a3",
  measurementId: "G-5T6820P11N"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
