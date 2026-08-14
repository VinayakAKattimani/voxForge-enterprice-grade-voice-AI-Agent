import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

import {
  loginRequest,
  registerRequest,
  logoutRequest,
  refreshRequest,
  getCurrentUserRequest,
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
  // PERSIST AUTH
  // --------------------------------------------------

  const persistAuth = useCallback(
    (authResponse) => {

      const {
        access_token,
        refresh_token,
      } = authResponse;

      if (access_token) {
        window.sessionStorage.setItem(
          'voxforge-access-token',
          access_token
        );

        setIsAuthenticated(true);
      }

      if (refresh_token) {
        window.sessionStorage.setItem(
          'voxforge-refresh-token',
          refresh_token
        );
      }
    },
    []
  );


  // --------------------------------------------------
  // GET CURRENT USER
  // --------------------------------------------------

  const fetchCurrentUser = useCallback(
  async () => {
    try {
      console.log('🔵 FETCHING CURRENT USER');

      const currentUser = await getCurrentUserRequest();

      console.log(
        '🟢 CURRENT USER FROM API:',
        currentUser
      );

      const normalizedUser = {
        id: currentUser.id,

        name: [
          currentUser.first_name,
          currentUser.last_name,
        ]
          .filter(Boolean)
          .join(' '),

        email: currentUser.email,

        role: currentUser.role_id,

        avatarInitials:
          `${currentUser.first_name?.[0] || ''}${currentUser.last_name?.[0] || ''}`
            .toUpperCase(),

        org: 'VoxForge',

        plan: 'Free',

        isActive: currentUser.is_active,

        isVerified: currentUser.is_verified,

        createdAt: currentUser.created_at,

        updatedAt: currentUser.updated_at,
      };

      console.log(
        '🟢 NORMALIZED USER:',
        normalizedUser
      );

      setUser(normalizedUser);

      window.sessionStorage.setItem(
        'voxforge-user',
        JSON.stringify(normalizedUser)
      );

      return normalizedUser;

    } catch (error) {

      console.error(
        '🔴 FAILED TO FETCH CURRENT USER:',
        error
      );

      throw error;
    }
  },
  []
);


  // --------------------------------------------------
  // RESTORE SESSION
  // --------------------------------------------------

  useEffect(() => {
  const accessToken =
    window.sessionStorage.getItem(
      'voxforge-access-token'
    );

  const refreshToken =
    window.sessionStorage.getItem(
      'voxforge-refresh-token'
    );

  if (!accessToken && !refreshToken) {
    return;
  }

  const restoreSession = async () => {
    try {
      console.log('🔵 RESTORING SESSION');

      await fetchCurrentUser();

      setIsAuthenticated(true);

      console.log('🟢 SESSION RESTORED');

    } catch (error) {

      console.error(
        '🔴 SESSION RESTORE FAILED:',
        error
      );

      setUser(null);
      setIsAuthenticated(false);

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
  };

  restoreSession();

}, [fetchCurrentUser]);


  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const login = useCallback(
    async (email, password) => {

      setLoading(true);
      setError(null);

      try {

        console.log('🔵 LOGIN');

        const response = await loginRequest(
          email,
          password
        );

        console.log(
          '🟢 LOGIN SUCCESS:',
          response
        );

        persistAuth(response);

        await fetchCurrentUser();

        return response;

      } catch (e) {

        console.error(
          '🔴 LOGIN FAILED:',
          e
        );

        setError(e.message);

        throw e;

      } finally {

        setLoading(false);
      }
    },
    [persistAuth, fetchCurrentUser]
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

        /*
         * If registration returns tokens,
         * persist them and fetch the real user.
         */

        if (response.access_token) {

          persistAuth(response);

          await fetchCurrentUser();

        }

        return response;

      } catch (e) {

        setError(e.message);

        throw e;

      } finally {

        setLoading(false);
      }
    },
    [persistAuth, fetchCurrentUser]
  );


  // --------------------------------------------------
  // REFRESH TOKEN
  // --------------------------------------------------

  const testRefresh = useCallback(
    async () => {

      const refreshToken =
        window.sessionStorage.getItem(
          'voxforge-refresh-token'
        );

      console.log(
        '🔵 REFRESH TOKEN:',
        refreshToken
      );

      if (!refreshToken) {

        console.log(
          '❌ NO REFRESH TOKEN'
        );

        return;
      }

      try {

        console.log(
          '🔵 CALLING REFRESH API'
        );

        const response =
          await refreshRequest(
            refreshToken
          );

        console.log(
          '🟢 REFRESH SUCCESS:',
          response
        );

        persistAuth(response);

        console.log(
          '🟢 TOKENS UPDATED'
        );

      } catch (error) {

        console.error(
          '🔴 REFRESH FAILED:',
          error
        );
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

        if (refreshToken) {

          await logoutRequest(
            refreshToken
          );
        }

      } catch (error) {

        console.error(
          'Logout API failed:',
          error
        );

      } finally {

        setUser(null);
        setIsAuthenticated(false);

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
        testRefresh,
        fetchCurrentUser,
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