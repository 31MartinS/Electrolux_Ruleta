import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc 
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Guardar un nuevo participante
export async function guardarParticipante(datos) {
  const ref = collection(db, "participantes");

  // Verificar si ya existe el email
  const q = query(ref, where("email", "==", datos.email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    throw new Error('Este correo ya fue registrado.');
  }

  await addDoc(ref, datos);
}

// Asignar premio al participante
export async function asignarPremio(email, premio) {
  const ref = collection(db, "participantes");
  const q = query(ref, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const participanteRef = doc(db, "participantes", docSnap.id);
    await updateDoc(participanteRef, { premio });
  }
}
