// Import the functions you need from the SDKs you need

import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyC_Bp8JzMLE093PfdBdi5X4YU8jp35rAjw",

    authDomain: "slareaclone.firebaseapp.com",

    projectId: "slareaclone",

    storageBucket: "slareaclone.appspot.com",

    messagingSenderId: "88258995712",

    appId: "1:88258995712:web:09637411e196f0dc1f1ae5",

    measurementId: "G-X38BZB89FJ"

};


// Initialize Firebase

firebase.initializeApp(firebaseConfig)
export default firebase;