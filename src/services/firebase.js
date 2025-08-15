// firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

// Configuración de Firebase (reemplaza con la tuya de Firebase Console)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Guardar participante (docId = emailLower y campos obligatorios)
export async function guardarParticipante({ nombre, cedula, celular, email }) {
  const emailLower = String(email).trim().toLowerCase()
  const ref = doc(db, 'participantes', emailLower)

  await setDoc(ref, {
    nombre: String(nombre ?? ''),
    cedula: String(cedula ?? ''),
    celular: String(celular ?? ''),
    email: String(email ?? ''),
    emailLower,
    createdAt: serverTimestamp()
  }, { merge: false })
}

// Asignar premio (único update permitido)
export async function asignarPremio(email, premio) {
  const emailLower = String(email).trim().toLowerCase()
  const ref = doc(db, 'participantes', emailLower)

  await updateDoc(ref, {
    premio: String(premio ?? '')
  })
}

export { db }
