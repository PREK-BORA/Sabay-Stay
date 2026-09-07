import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
  apiKey: "AIzaSyBsr5-OyDshO8EoSC6Eu6485PZoakcH144",
  authDomain: "sabay-stay-91d99.firebaseapp.com",
  projectId: "sabay-stay-91d99",
  storageBucket: "sabay-stay-91d99.firebasestorage.app",
  messagingSenderId: "232042075773",
  appId: "1:232042075773:web:b02531ff938f3088f04314"
};

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  return {
    provide: {
      db
    }
  }
})