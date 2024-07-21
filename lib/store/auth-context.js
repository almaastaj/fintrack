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
// Create the authContext with default values
export const authContext = createContext({
    user: null,
    loading: false,
    googleLoginHandler: async () => {},
    signInAsGuestHandler: async () => {},
    logout: async () => {},
});

export default function AuthContextProvider({ children }) {
    // State variables for authentication status and user
    const [user, loading] = useAuthState(auth);

    const googleProvider = new GoogleAuthProvider(auth);
    // Handler function for Google login
    const googleLoginHandler = async () => {
        try {
            // Sign in using a Google popup
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            throw error;
        }
    };
    // Handler function for guest sign-in
    const signInAsGuestHandler = async () => {
        try {
            await signInWithEmailAndPassword(auth, "guest@email.com", "123456"); // Sign in using predefined guest credentials
        } catch (error) {
            throw error;
        }
    };
    // Function to handle logout
    const logout = () => {
        signOut(auth);
    };
    // Values to be provided to children components via context
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
