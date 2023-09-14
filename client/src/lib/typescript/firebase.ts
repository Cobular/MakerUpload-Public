
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyCOlK5ElRkrRWilwtNaFlM-T_X2kDHdmco',
    authDomain: 'makeruploadpublic.firebaseapp.com',
    projectId: 'makeruploadpublic',
    storageBucket: 'makeruploadpublic.appspot.com',
    messagingSenderId: '934307769091',
    appId: '1:934307769091:web:a85fc05edce9f56801d736'
};

export const fbApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(fbApp);
export const fbAuth = getAuth(fbApp);