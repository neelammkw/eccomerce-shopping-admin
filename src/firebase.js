// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDakfdCB6nyCv7qB-zBRxrc8GPxLakz65I",
  authDomain: "fashionfables-51ebe.firebaseapp.com",
  projectId: "fashionfables-51ebe",
  storageBucket: "fashionfables-51ebe.appspot.com",
  messagingSenderId: "1011789539379",
  appId: "1:1011789539379:web:45ba582a65e29128cddb46",
  measurementId: "G-XREM7HF0XB"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
