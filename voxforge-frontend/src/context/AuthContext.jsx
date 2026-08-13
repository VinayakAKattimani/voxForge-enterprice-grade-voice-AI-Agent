import {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';

import {
  loginRequest,
  registerRequest,
  logoutRequest,
} from '../api/authApi';


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

  // --------------------------------------------------
  // USER
  // --------------------------------------------------

  const [user, setUser] = useState(() => {
    try {
      const storedUser = window.sessionStorage.getItem(
        'voxforge-user'
      );

      return storedUser
        ? JSON.parse(storedUser)
        : null;

    } catch {
      return null;
    }
  });


  // --------------------------------------------------
  // AUTHENTICATION STATE
  // --------------------------------------------------

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!window.sessionStorage.getItem(
      'voxforge-access-token'
    );
  });


  // --------------------------------------------------
  // UI STATE
  // --------------------------------------------------

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // --------------------------------------------------
  // PERSIST AUTH TOKENS
  // --------------------------------------------------

  const persistAuth = useCallback(
    (authResponse, fallbackUser = null) => {

      const {
        access_token,
        refresh_token,
      } = authResponse;


      // Access token
      if (access_token) {

        window.sessionStorage.setItem(
          'voxforge-access-token',
          access_token
        );

        setIsAuthenticated(true);
      }


      // Refresh token
      if (refresh_token) {

        window.sessionStorage.setItem(
          'voxforge-refresh-token',
          refresh_token
        );
      }


      /*
       * Currently the auth-service login response
       * only contains tokens.
       *
       * Once user-service /me is implemented,
       * we will populate the complete user object.
       */

      if (fallbackUser) {

        setUser(fallbackUser);

        window.sessionStorage.setItem(
          'voxforge-user',
          JSON.stringify(fallbackUser)
        );
      }
    },
    []
  );


  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const login = useCallback(
    async (email, password) => {

      setLoading(true);
      setError(null);

      try {

        const response = await loginRequest(
          email,
          password
        );

        persistAuth(response);

        return response;

      } catch (e) {

        setError(e.message);

        throw e;

      } finally {

        setLoading(false);
      }
    },
    [persistAuth]
  );


  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------

  const register = useCallback(
    async (payload) => {

      setLoading(true);
      setError(null);

      try {

        const response = await registerRequest(
          payload
        );

        persistAuth(response);

        return response;

      } catch (e) {

        setError(e.message);

        throw e;

      } finally {

        setLoading(false);
      }
    },
    [persistAuth]
  );


  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const logout = useCallback(
    async () => {

      const refreshToken =
        window.sessionStorage.getItem(
          'voxforge-refresh-token'
        );


      try {

        /*
         * Tell Auth Service to invalidate
         * the refresh token.
         */

        if (refreshToken) {

          await logoutRequest(
            refreshToken
          );
        }

      } catch (error) {

        /*
         * Even if backend logout fails,
         * local authentication must still
         * be removed.
         */

        console.error(
          'Logout API failed:',
          error
        );

      } finally {

        // Clear React authentication state
        setUser(null);
        setIsAuthenticated(false);

        // Clear stored authentication data
        window.sessionStorage.removeItem(
          'voxforge-user'
        );

        window.sessionStorage.removeItem(
          'voxforge-access-token'
        );

        window.sessionStorage.removeItem(
          'voxforge-refresh-token'
        );
      }
    },
    []
  );


  // --------------------------------------------------
  // PROVIDER
  // --------------------------------------------------

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// --------------------------------------------------
// HOOK
// --------------------------------------------------

export function useAuth() {

  const ctx = useContext(AuthContext);

  if (!ctx) {

    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return ctx;
}