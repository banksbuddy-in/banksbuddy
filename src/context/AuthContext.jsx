import React, { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import { db } from "../firebase";
import { initializeApp } from "firebase/app";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password, name) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user entry in Realtime Database
        await set(ref(db, 'users/' + user.uid), {
            username: name,
            email: email,
            role: 'user' // Default role
        });

        return userCredential;
    }

    async function googleSignIn() {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user exists in DB
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${user.uid}`));

        if (!snapshot.exists()) {
            // Create new user entry
            await set(ref(db, 'users/' + user.uid), {
                username: user.displayName,
                email: user.email,
                role: 'user'
            });
        }

        return result;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch role
                const dbRef = ref(db);
                try {
                    const snapshot = await get(child(dbRef, `users/${user.uid}/role`));
                    if (snapshot.exists()) {
                        setUserRole(snapshot.val());
                    } else {
                        setUserRole('user'); // Fallback
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    setUserRole('user');
                }
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        signup,
        login,
        googleSignIn,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
