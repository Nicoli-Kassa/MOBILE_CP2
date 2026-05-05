import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAqxn-akWbeoWK9Ul3r6UF50vh2V5F5Jdc",
  authDomain: "mobile-c2-91b54.firebaseapp.com",
  projectId: "mobile-c2-91b54",
  databaseURL: "https://mobile-c2-91b54-default-rtdb.firebaseio.com/",
  storageBucket: "mobile-c2-91b54.firebasestorage.app",
  messagingSenderId: "905219118936",
  appId: "1:905219118936:web:713a30588fda00f21eb72d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
