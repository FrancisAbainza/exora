"use client"

import { auth } from "@/firebase/client";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react"
import { removeToken, saveUser, setToken } from "./actions";
import { useRouter } from "next/navigation";

type AuthContextType = {
  currentUser: User | null;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user ?? null);
      if (user) {
        // Store token and refresh token in cookies
        const tokenResult = await user.getIdTokenResult();
        const token = tokenResult.token;
        const refreshToken = user.refreshToken;
        if (token && refreshToken) {
          await setToken({
            token,
            refreshToken
          });
        }

        // NOTE: You cannot pass user as an argument to saveUser
        const { uid, displayName, photoURL } = user;
        saveUser(uid, displayName, photoURL);
      } else {
        await removeToken();
      }
      router.refresh();
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      logout,
      loginWithGoogle,
      loginWithEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);