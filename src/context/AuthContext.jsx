import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../lib/api";

const STORAGE_KEY = "handiplug_auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | LOAD SAVED AUTHENTICATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadAuth() {
      let cachedToken = null;
      let cachedUser = null;

      try {
        const raw =
          localStorage.getItem(STORAGE_KEY);

        if (raw) {
          const parsed =
            JSON.parse(raw);

          cachedToken =
            parsed.token || null;

          cachedUser =
            parsed.user || null;

          setToken(cachedToken);
          setUser(cachedUser);
        }
      } catch (error) {
        console.error(
          "Failed to read saved authentication:",
          error
        );

        localStorage.removeItem(
          STORAGE_KEY
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Refresh user from backend
      |--------------------------------------------------------------------------
      */

      if (cachedToken) {
        try {
          const {
            user: refreshedUser,
          } = await api.me(
            cachedToken
          );

          setUser(refreshedUser);

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              token: cachedToken,
              user: refreshedUser,
            })
          );
        } catch (error) {
          console.error(
            "Authentication hydration failed:",
            error
          );

          /*
          |--------------------------------------------------------------------------
          | Only clear the token for actual authentication failures
          |--------------------------------------------------------------------------
          */

          if (
            error.status &&
            error.status >= 400 &&
            error.status < 500
          ) {
            setToken(null);
            setUser(null);

            localStorage.removeItem(
              STORAGE_KEY
            );
          }
        }
      }

      setIsHydrating(false);
    }

    loadAuth();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SAVE AUTHENTICATION
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | REGISTER
  |--------------------------------------------------------------------------
  */

  const register = async (
    payload
  ) => {
    /*
     * Registration does NOT create a JWT.
     *
     * The backend creates the user,
     * generates the OTP and sends it
     * through Brevo.
     */

    return await api.register(
      payload
    );
  };

  /*
  |--------------------------------------------------------------------------
  | VERIFY OTP
  |--------------------------------------------------------------------------
  */

  const verifyOtp = async (email, otp) => {
  const {
    token: t,
    user: u,
  } = await api.verifyOtp({
    email,
    otp,
  });

  persist(t, u);

  return u;
  };

    /*
     * JWT is only received after
     * successful OTP verification.
     */

    persist(
      nextToken,
      nextUser
    );

    return nextUser;
  };

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const login = async (
    email,
    password
  ) => {
    const {
      token: nextToken,
      user: nextUser,
    } = await api.login({
      email,
      password,
    });

    persist(
      nextToken,
      nextUser
    );

    return nextUser;
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const logout = () => {
    persist(
      null,
      null
    );
  };

  /*
  |--------------------------------------------------------------------------
  | CONTEXT
  |--------------------------------------------------------------------------
  */

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