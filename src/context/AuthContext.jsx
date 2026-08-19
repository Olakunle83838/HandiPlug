import { createContext, useContext, useEffect, useState,} from "react";
import { api } from "../lib/api";

const STORAGE_KEY = "handiplug_auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    async function loadAuth() {
      let cachedToken = null;
      let cachedUser = null;
      
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          cachedToken = parsed.token;
          cachedUser = parsed.user;
          setToken(cachedToken);
          setUser(cachedUser);
        }
      } catch {
        // ignore corrupted storage
      }
      
      if (cachedToken) {
        try {
          const { user: refreshedUser } = await api.me(cachedToken);
          setUser(refreshedUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: cachedToken, user: refreshedUser }));
        } catch (err) {
          console.error("Hydration failed", err);
          if (err.status && err.status >= 400 && err.status < 500) {
            // Token invalid or suspended
            setToken(null);
            setUser(null);
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
      setIsHydrating(false);
    }
    
    loadAuth();
=======
    try {
      const raw =
        localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const parsed =
          JSON.parse(raw);

        setToken(parsed.token);
        setUser(parsed.user);
      }
    } catch {
      localStorage.removeItem(
        STORAGE_KEY
      );
    }

    setReady(true);
>>>>>>> 17a0c4f (update on back and frontend)
  }, []);

  const persist = (
    nextToken,
    nextUser
  ) => {
    setToken(nextToken);
    setUser(nextUser);

    if (nextToken) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token: nextToken,
          user: nextUser,
        })
      );
    } else {
      localStorage.removeItem(
        STORAGE_KEY
      );
    }
  };

  const register = async (payload) => {
<<<<<<< HEAD
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
=======
    return await api.register(payload);
  };

  const verifyOtp = async (
    email,
    otp
  ) => {

    const {
      token: t,
      user: u,
    } = await api.verifyOtp({
      email,
      otp,
    });

>>>>>>> 17a0c4f (update on back and frontend)
    persist(t, u);

    return u;
  };

  const login = async (
    email,
    password
  ) => {

    const {
      token: t,
      user: u,
    } = await api.login({
      email,
      password,
    });

    persist(t, u);

    return u;
  };

  const logout = () => {
    persist(null, null);
  };

  return (
<<<<<<< HEAD
    <AuthContext.Provider value={{ token, user, isHydrating, register, verifyOtp, handleMagicLink, login, logout, isAuthed: !!token }}>
=======
    <AuthContext.Provider
      value={{
        token,
        user,
        ready,
        register,
        verifyOtp,
        login,
        logout,
        isAuthed: !!token,
      }}
    >
>>>>>>> 17a0c4f (update on back and frontend)
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx =
    useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}