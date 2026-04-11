"use client";

import { createContext, useEffect, useState, useContext } from "react"
import type { User as FirebaseUser } from "firebase/auth"
import {
        onAuthStateChangedListener,
        subscribeToUserProfile, 
        signIn as fbSignIn, 
        signOut as fbSignOut, 
        createUser as createFbUser, 
        getIdToken, 
        UserProfile,
        deleteAccountWithPassword
    } from "./authClient"
import { useTheme } from "next-themes";


type AuthContextValue = {
    user : FirebaseUser | null
    profile : UserProfile | null
    loading : boolean
    signIn : (email:string, password:string) => Promise<FirebaseUser>
    signOut : () => Promise<void>
    getIdToken : (force?: boolean) => Promise<string | null>
    createUser : (email:string, password:string, name:string) => Promise<FirebaseUser>
    deleteAccount : (password: string) => Promise<void>
}


const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth(){
    const ctx = useContext(AuthContext)
    if(!ctx) throw new Error("useAuth must be used within an AuthProvider")
    return ctx
}

export function AuthProvider({children}:{children: React.ReactNode}){
    const [user, setUser] = useState<FirebaseUser | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const { setTheme } = useTheme();

    useEffect(() => {
      if (!profile) return;

      const prefersDark = profile.nextillApp.settings.darkmode;

      setTheme(prefersDark ? "dark" : "light");
    }, [profile, setTheme]);
  
    useEffect(() => {
        let profileUnsub: (() => void) | null = null
        const unsubscribeAuth = onAuthStateChangedListener(async (fbUser, fetchedProfile) => {
            setUser(fbUser)
            //if fbUser is null => signed out. clean up listener and state.
            if(!fbUser){
                setProfile(null)
                setLoading(false)
                if(profileUnsub){
                    profileUnsub()
                    profileUnsub = null
                }
                return
            }
            // we have a firebase profile. If the profile was provided by the listeners, use it.
            if(fetchedProfile){setProfile(fetchedProfile)}
            //if there is a subscription from a previous user, usunbscribe.
            if(profileUnsub){
                profileUnsub()
                profileUnsub = null
            }
            //subscribe to a realtime listener for this user.
            try {
                profileUnsub = subscribeToUserProfile(fbUser.uid, p => setProfile(p))   
            }catch(err){
                console.error("Failed to subscribe to user profile:", err)
            }
            setLoading(false)
        })
        return () => {
            unsubscribeAuth()
            if(profileUnsub) profileUnsub()
        }
    }, [])

    async function signIn(email:string, password:string) {
        setLoading(true)
        try{
            const u = await fbSignIn(email, password)
            return u
        }finally{
            setLoading(false)
        }
    }

    async function signOut(){
        setLoading(true)
        try{
            await fbSignOut()
        }finally{
            setLoading(false)
        }
    }

    async function createUser(email:string, password:string, name:string){
        setLoading(true)
        try {
            const u = await createFbUser(email, password, name)
            return u
        }finally{
            setLoading(false)
        }
    }

    async function deleteAccount(password: string) {
        setLoading(true);
        try {
            await deleteAccountWithPassword(password);
        } catch (error: unknown) {
            console.error("Error deleting account:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const value: AuthContextValue = {
        user,
        profile,
        loading,
        signIn,
        signOut,
        getIdToken,
        createUser,
        deleteAccount
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

export default AuthProvider

