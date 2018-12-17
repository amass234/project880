import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/messaging';

let config = {
  apiKey: "AIzaSyD8vXaq20KTGVf0yCE0hiHmVlCKylids-k",
  authDomain: "fir-863af.firebaseapp.com",
  databaseURL: "https://fir-863af.firebaseio.com",
  projectId: "fir-863af",
  storageBucket: "fir-863af.appspot.com",
  messagingSenderId: "756706643465"
};

const Firebase = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
Firebase.firestore().settings({ timestampsInSnapshots: true })

export default Firebase;