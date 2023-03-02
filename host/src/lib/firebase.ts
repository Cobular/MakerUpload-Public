import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const app = initializeApp({
  apiKey: "AIzaSyAIhrL-_VrBwXJ5FYWqaArYM1k95NGEn_Y",
  authDomain: "makersync-eef57.firebaseapp.com",
  projectId: "makersync-eef57",
  storageBucket: "makersync-eef57.appspot.com",
  messagingSenderId: "258392267318",
  appId: "1:258392267318:web:328fa8bc2e456878625697"
})

export const firestore = getFirestore(app);
