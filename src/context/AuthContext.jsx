import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const STORAGE_KEY = "handiplug_auth";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setToken(parsed.token);
        setUser(parsed.user);
      }
    } catch {
      // ignore corrupted storage
    }
    setReady(true);
  }, []);

  const persist = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    if (nextToken) localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const register = async (payload) => {
    // Only register, do not persist yet because we need OTP verification
    const res = await api.register(payload);
    return res;
  };

  const verifyOtp = async (payload) => {
    const { token: t, user: u } = await api.verifyOtp(payload);
    persist(t, u);
    return u;
  };

  const handleMagicLink = async (tokenHash, type = 'email') => {
    const { token: t, user: u } = await api.magicLinkLogin({ tokenHash, type });
    persist(t, u);
    return u;
  };

  const login = async (email, password) => {
    const { token: t, user: u } = await api.login({ email, password });
    persist(t, u);
    return u;
  };

  const logout = () => persist(null, null);

  return (
    <AuthContext.Provider value={{ token, user, ready, register, verifyOtp, handleMagicLink, login, logout, isAuthed: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
