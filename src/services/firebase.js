// src/services/firebase.js
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  initializeFirestore,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAkt5GPpWuI4QPO8Jy4R4QTTpaaRg1_lMg",
  authDomain: "spin-wheel-app-35165.firebaseapp.com",
  projectId: "spin-wheel-app-35165",
  storageBucket: "spin-wheel-app-35165.firebasestorage.app",
  messagingSenderId: "860062847623",
  appId: "1:860062847623:web:fddde745a462558c3bde22"
}

const app = initializeApp(firebaseConfig)

// Transporte compatible (redes estrictas / bloqueadores)
initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false
})

const db = getFirestore(app)

// CREATE
export async function guardarParticipante({ nombre, cedula, celular, email }) {
  const emailLower = String(email).trim().toLowerCase()
  const ref = doc(db, "participantes", emailLower)
  await setDoc(ref, {
    nombre: String(nombre ?? ""),
    cedula: String(cedula ?? ""),
    celular: String(celular ?? ""),
    email: String(email ?? ""),
    emailLower,
    createdAt: serverTimestamp()
  }, { merge: false })
}

// UPDATE SOLO 'premio'
export async function asignarPremio(email, premio) {
  const emailLower = String(email).trim().toLowerCase()
  const ref = doc(db, "participantes", emailLower)
  await updateDoc(ref, { premio: String(premio ?? "") })
}

export { db }
