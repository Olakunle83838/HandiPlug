import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { createOtpPayload } from "../lib/otpPayload";

const STORAGE_KEY = "handiplug_auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    async function loadAuth() {
      let cachedToken = null;

      try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (raw) {
          const parsed = JSON.parse(raw);

          cachedToken = parsed.token || null;

          setToken(cachedToken);
          setUser(parsed.user || null);
        }
      } catch (err) {
        console.error("Failed to load saved authentication:", err);
        localStorage.removeItem(STORAGE_KEY);
      }

      /*
       * If a token exists, verify it against the backend.
       */
      if (cachedToken) {
        try {
          const response = await api.me(cachedToken);

          const refreshedUser = response.user;

          setUser(refreshedUser);

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              token: cachedToken,
              user: refreshedUser,
            })
          );
        } catch (err) {
          console.error("Authentication hydration failed:", err);

          /*
           * If the backend says the token is invalid,
           * clear the saved authentication.
           */
          if (
            err.status &&
            err.status >= 400 &&
            err.status < 500
          ) {
            setToken(null);
            setUser(null);
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }

      setIsHydrating(false);
    }

    loadAuth();
  }, []);

  /*
   * Save authentication information.
   */
  const persist = (nextToken, nextUser) => {
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
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  /*
   * REGISTER
   */
  const register = async (payload) => {
    const response = await api.register(payload);

    return response;
  };

  /*
  |--------------------------------------------------------------------------
  | VERIFY OTP
  |--------------------------------------------------------------------------
  */

  const verifyOtp = async (credentials) => {
    const payload = createOtpPayload(credentials);
    const { token: nextToken, user: nextUser } = await api.verifyOtp(payload);

    persist(nextToken, nextUser);
    return nextUser;
  };

  /*
   * LOGIN
   */
  const login = async (email, password) => {
    const response = await api.login({
      email,
      password,
    });

    const nextToken = response.token;
    const nextUser = response.user;

    persist(nextToken, nextUser);

    return nextUser;
  };

  /*
   * LOGOUT
   */
  const logout = () => {
    persist(null, null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isHydrating,
        register,
        verifyOtp,
        login,
        logout,
        isAuthed: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}