// src/services/firebase.js
import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"

// Configuración real de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAkt5GPpWuI4QPO8Jy4R4QTTpaaRg1_lMg",
  authDomain: "spin-wheel-app-35165.firebaseapp.com",
  projectId: "spin-wheel-app-35165",
  storageBucket: "spin-wheel-app-35165.firebasestorage.app",
  messagingSenderId: "860062847623",
  appId: "1:860062847623:web:fddde745a462558c3bde22",
  measurementId: "G-VTKB467MKS"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Guardar participante (ID = emailLower y campos requeridos por las reglas)
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

// Asignar premio (único update permitido por las reglas)
export async function asignarPremio(email, premio) {
  const emailLower = String(email).trim().toLowerCase()
  const ref = doc(db, "participantes", emailLower)

  await updateDoc(ref, {
    premio: String(premio ?? "")
  })
}

export { db }
