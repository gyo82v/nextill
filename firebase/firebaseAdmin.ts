import {initializeApp, cert, getApps} from "firebase-admin/app"
import {getFirestore} from "firebase-admin/firestore"
import {getAuth} from "firebase-admin/auth"

const serviceAccout = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 ? 
                      JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString()) :
                      process.env.FIREBASE_SERVICE_ACCOUNT_KEY ?
                      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) : undefined

if(!serviceAccout){
    throw new Error("Missing service account.Set FIREBASE_SERVICE_ACCOUNT_KEY or _BASE64 env var.")
}

//avoid reinitializing in serverless/hot reload 
declare global { var __firebaseAdminAppInitialized: boolean | undefined }

if(!getApps().length && !global.__firebaseAdminAppInitialized){
    initializeApp({credential : cert(serviceAccout)})
    global.__firebaseAdminAppInitialized = true;
}

export const adminDb = getFirestore()
export const adminAuth = getAuth()