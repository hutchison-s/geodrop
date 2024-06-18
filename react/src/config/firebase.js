// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const storage = getStorage()


export async function uploadFile(f, userId) {
  console.log(f, userId);
  const path = `files/${userId}/${Date.now()}.${f.type.split('/')[1]}`
  const fileRef = ref(storage, path);
  const uploaded = await uploadBytes(fileRef, f);
  const url = await getDownloadURL(uploaded.ref);
  return {url, path};
}

export async function deleteFile(path) {
  try {
    const fileRef = ref(storage, path);
    const deleted = await deleteObject(fileRef);
    console.log('deleted file', deleted);
  } catch (error) {
    console.log(error);
  }
}
