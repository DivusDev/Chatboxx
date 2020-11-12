//import firebase
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


//init firebase
firebase.initializeApp({
    apiKey: "AIzaSyCcWAQNpPKdBmAg7IOEomCz9Hp2cBX-a5I",
    authDomain: "chat-app-c1488.firebaseapp.com",
    databaseURL: "https://chat-app-c1488.firebaseio.com",
    projectId: "chat-app-c1488",
    storageBucket: "chat-app-c1488.appspot.com",
    messagingSenderId: "477643606564",
    appId: "1:477643606564:web:f4a2b64c247a00fdaee6b1",
    measurementId: "G-H53TG4WW44"
  });
  
  //set auth and firestore
  const auth = firebase.auth();
  const firestore = firebase.firestore();
  
  const roomsRef = firestore.collection('rooms');



  export { firebase, auth, firestore, roomsRef }

