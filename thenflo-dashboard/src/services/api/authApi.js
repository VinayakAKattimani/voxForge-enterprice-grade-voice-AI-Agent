import { apiClient, USE_MOCK, tokenStore } from "./client.js";
import { delay, delayFail } from "../mock/mockDb.js";
import { CURRENT_USER } from "../mock/mockData.js";

/**
 * Auth service. Handles login/logout and the currently authenticated user.
 * ProtectedRoute + AuthContext are the only consumers of this module.
 */
export const authApi = {
  async login({ email, password }) {
    if (USE_MOCK) {
      if (!email || !password) return delayFail("Enter an email and password.", 300);
      tokenStore.setTokens({ accessToken: "mock-access-token", refreshToken: "mock-refresh-token" });
      return delay({ user: CURRENT_USER, accessToken: "mock-access-token" }, 500);
    }
    const data = await apiClient.post("/auth/login", { email, password });
    tokenStore.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    return data;
  },

  async logout() {
    if (USE_MOCK) {
      tokenStore.clearTokens();
      return delay(null, 150);
    }
    await apiClient.post("/auth/logout", {});
    tokenStore.clearTokens();
    return null;
  },

  async getCurrentUser() {
    if (USE_MOCK) {
      const hasToken = tokenStore.getAccessToken();
      return hasToken ? delay(CURRENT_USER, 250) : delayFail("Not authenticated", 100);
    }
    return apiClient.get("/auth/me");
  },
};
