// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBZ_LFIjKYML31rDZ6pwV5jyBH-sk0JyKU",
  authDomain: "whatsapp-clone-db003.firebaseapp.com",
  projectId: "whatsapp-clone-db003",
  storageBucket: "whatsapp-clone-db003.appspot.com",
  messagingSenderId: "184652194448",
  appId: "1:184652194448:web:5bdf0e49d4d49c3ba72e15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth=getAuth(app)