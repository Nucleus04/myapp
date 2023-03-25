import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDsnkaIVPdEuU-zfxJSg5AlyQDasGfO3zE",
    authDomain: "myapp-2d887.firebaseapp.com",
    projectId: "myapp-2d887",
    storageBucket: "myapp-2d887.appspot.com",
    messagingSenderId: "279112424742",
    appId: "1:279112424742:web:ca3cfcae622b13e186b5e7",
    measurementId: "G-57GJ5WVX3N"
};

const app = firebase.initializeApp(firebaseConfig);


export const auth = app.auth();
export const firestore = app.firestore();
export default app;
