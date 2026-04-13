import {auth, db} from "./firebase"
import { 
        signInWithEmailAndPassword, 
        onAuthStateChanged as fbOnAuthStateChanged, 
        signOut as fbSignOut, 
        getIdToken as fbGetIdToken, 
        User as FirebaseUser, 
        createUserWithEmailAndPassword as createFbUser,
        EmailAuthProvider,
        reauthenticateWithCredential,
        deleteUser 
    } from "firebase/auth"
import {
        doc, 
        getDoc, 
        setDoc, 
        onSnapshot, 
        serverTimestamp, 
        deleteDoc
    } from "firebase/firestore"
import type {UserProfile} from "@/types"

// sign in (client)

export async function signIn(email:string, password:string){
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const user = credential.user
    return user
}

// sign out

export async function signOut(){
    await fbSignOut(auth)
}

// create new user

export async function createUser(email:string, password:string, name:string){
  const credential =  await createFbUser(auth, email, password)
  const user = credential.user
  await createUserProfileIfNotExists(user, name)
  return user
}

// return the current user ID token

export async function getIdToken(force = false):Promise<string | null> {
    const user = auth.currentUser
    if(!user) return null 
    return await fbGetIdToken(user, force)
}

// return current user 

export function getCurrentUser(){
    return auth.currentUser //null if user is not logged in
}

// delete account with password

export async function deleteAccountWithPassword(password: string) {
  const user = auth.currentUser;

  if (!user) throw new Error("No authenticated user.");

  if (!user.email) throw new Error("User email not available.");

  try {
    //  1. Re-authenticate (required by Firebase)
    const credential = EmailAuthProvider.credential(user.email, password);

    await reauthenticateWithCredential(user, credential);

    const uid = user.uid;

    //  2. Delete user profile document
    await deleteDoc(doc(db, "users", uid));

    //  3. Delete auth account
    await deleteUser(user);

    return { success: true };
  } catch (error: unknown) {
    console.error("Delete account error:", error);
    throw error;
  }
}

/////FIRESTORE/////

// create a user doc if it doesnt exists

export async function createUserProfileIfNotExists(user:FirebaseUser, name:string){
    if(!user || !user.uid) throw new Error("Invalid user for profile creation.")
    const ref = doc(db, "users", user.uid)
    const snap = await getDoc(ref)
    if(!snap.exists()){
        const profile:UserProfile = {
            uid : user.uid,
            email : user.email,
            displayName : name,
            createdAt : serverTimestamp(),
            jadeLilyCredit : 0,
            jadeLilyTotalOrders : 0, 
            jadeLilyCart : [],
            jadeLilyPastOrders : [],
            jadeLilyCreditUsed : 0,
            nextillApp: {
                settings: {
                    darkmode: false,
                    language: "en",
                    dayActive: false,
                    dayDate: null
                },
                dayCycle: {
                    active: false,
                    startedAt: null,
                    endedAt: null,
                    openingBalance: null,
                    closingBalance: null,
                }
            }
        }
        await setDoc(ref, profile)
        return profile
    }
    return snap.data() as UserProfile
}

// fecth a single user profile 

export async function getUserProfile(uid:string):Promise<UserProfile | null> {
    const ref = doc(db, "users", uid)
    const snap = await getDoc(ref)
    if(!snap.exists()) return null
    return snap.data() as UserProfile
}

// real time listener for profile changes 

export function subscribeToUserProfile(uid:string, onUpdate: (profile : UserProfile | null) => void){
    const ref = doc(db, "users", uid)
    const unsubscribe = onSnapshot(ref, snap => {
        onUpdate(snap.exists() ? (snap.data() as UserProfile) : null)
    })
    return unsubscribe
}

/////CLIENT AUTH LISTENER//////

export function onAuthStateChangedListener(onChange: (user: FirebaseUser | null, profile : UserProfile | null) => void){
    const unsubscribe = fbOnAuthStateChanged(auth, async (user) => {
        if(!user){onChange(null, null); return}

        try {
            const profile = await getUserProfile(user.uid)
            onChange(user, profile)
        }catch(err){
            console.error("Failed to fetch user profile after auth change: ", err)
            onChange(user, null)
        }
    })

    return unsubscribe
}
