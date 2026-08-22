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

<<<<<<< HEAD
          cachedToken = parsed.token || null;
          cachedUser = parsed.user || null;
=======
          cachedToken =
            parsed.token || null;
>>>>>>> 7a20faa7f677d151a136ac9183b6d9b20de65645

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
<<<<<<< HEAD
   * VERIFY OTP
   */
  const verifyOtp = async (email, otp) => {
    const response = await api.verifyOtp({
      email,
      otp,
    });

    const nextToken = response.token;
    const nextUser = response.user;

    persist(nextToken, nextUser);
=======
  |--------------------------------------------------------------------------
  | VERIFY OTP
  |--------------------------------------------------------------------------
  */

  const verifyOtp = async (credentials) => {
    const payload = createOtpPayload(credentials);
    const { token: nextToken, user: nextUser } = await api.verifyOtp(payload);
>>>>>>> 7a20faa7f677d151a136ac9183b6d9b20de65645

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
<<<<<<< HEAD
=======

>>>>>>> 7a20faa7f677d151a136ac9183b6d9b20de65645

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

<<<<<<< HEAD
  return context;
}
=======
  return ctx;
}
>>>>>>> 7a20faa7f677d151a136ac9183b6d9b20de65645
