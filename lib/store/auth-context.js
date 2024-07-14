"use client";

import { createContext } from "react";

import { auth } from "@/lib/firebase";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export const authContext = createContext({
    user: null,
    loading: false,
    googleLoginHandler: async () => {},
    signInAsGuestHandler: async () => {},
    logout: async () => {},
});

export default function AuthContextProvider({ children }) {
    const [user, loading] = useAuthState(auth);

    const googleProvider = new GoogleAuthProvider(auth);

    const googleLoginHandler = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            throw error;
        }
    };

    const signInAsGuestHandler = async () => {
        try {
            await signInWithEmailAndPassword(auth, "guest@email.com", "123456");
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        signOut(auth);
    };

    const values = {
        user,
        loading,
        googleLoginHandler,
        signInAsGuestHandler,
        logout,
    };

    return (
        <authContext.Provider value={values}>{children}</authContext.Provider>
    );
}
