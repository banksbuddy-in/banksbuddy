import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import { db } from "../firebase";
import { initializeApp } from "firebase/app";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

// Hardcoded admin UID — only this user gets admin access
const ADMIN_UID = "YNzKifqerZSPHAFVqfpUFxbwcRB2";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Create user entry in Realtime Database
    await set(ref(db, "users/" + user.uid), {
      username: name,
      email: email,
      role: user.uid === ADMIN_UID ? "admin" : "user",
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
      await set(ref(db, "users/" + user.uid), {
        username: user.displayName,
        email: user.email,
        role: user.uid === ADMIN_UID ? "admin" : "user",
      });
    }

    return result;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    localStorage.removeItem("cibilPaid");
    localStorage.removeItem("userEmail");
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Admin is determined by UID, no database read needed
        if (user.uid === ADMIN_UID) {
          setUserRole("admin");
        } else {
          setUserRole("user");
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
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
