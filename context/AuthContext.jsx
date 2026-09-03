"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signUp, signOut, updateUser } from "../lib/auth-client";

const AuthContext = createContext(null);
const TOKEN_KEY = "mediqueue_jwt";

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession();
  const rawUser = session?.user || null;
  const user = rawUser
    ? { ...rawUser, displayName: rawUser.name, photoURL: rawUser.image }
    : null;

  const [token, setToken] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      if (!rawUser) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setTokenLoading(false);
        return;
      }
      const saved = localStorage.getItem(TOKEN_KEY);
      if (saved) {
        setToken(saved);
        setTokenLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/jwt");
        const data = await res.json();
        if (data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          setToken(data.token);
        }
      } finally {
        setTokenLoading(false);
      }
    };
    if (!isPending) fetchToken();
  }, [rawUser, isPending]);

  const registerUser = async (name, email, photoURL, password) => {
    const { data, error } = await signUp.email({ name, email, password, image: photoURL });
    if (error) throw error;
    return data;
  };

  const loginUser = async (email, password) => {
    const { data, error } = await signIn.email({ email, password });
    if (error) throw error;
    const res = await fetch("/api/jwt");
    const jwtData = await res.json();
    if (jwtData.token) {
      localStorage.setItem(TOKEN_KEY, jwtData.token);
      setToken(jwtData.token);
    }
    return data;
  };

  const loginWithGoogle = async () => {
    const { data, error } = await signIn.social({ provider: "google", callbackURL: "/" });
    if (error) throw error;
    return data;
  };

  const logoutUser = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    await signOut();
  };

  const updateUserProfile = async (name, photoURL) => {
    const { data, error } = await updateUser({ name, image: photoURL });
    if (error) throw error;
    return data;
  };

  const value = {
    user,
    loading: isPending || tokenLoading,
    token,
    registerUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
