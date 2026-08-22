import React, { createContext, useCallback, useEffect, useState } from "react";
import { authApi } from "../services/api/authApi.js";
import { tokenStore } from "../services/api/client.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking"); // checking | authenticated | unauthenticated

  useEffect(() => {
    if (!tokenStore.getAccessToken()) {
      setStatus("unauthenticated");
      return;
    }
    authApi
      .getCurrentUser()
      .then((u) => {
        setUser(u);
        setStatus("authenticated");
      })
      .catch(() => {
        tokenStore.clearTokens();
        setStatus("unauthenticated");
      });
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: loggedInUser } = await authApi.login({ email, password });
    setUser(loggedInUser);
    setStatus("authenticated");
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>{children}</AuthContext.Provider>
  );
}
