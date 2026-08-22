/**
 * Centralized API client.
 *
 * Every request the dashboard makes flows through here:
 *
 *   React page -> services/api/*Api.js -> apiClient -> ThenFLo API Gateway
 *
 * Components never call fetch() directly. This is the only file that knows
 * about base URLs, headers, auth tokens and error shapes, so swapping
 * transports (or pointing at a different gateway) never touches UI code.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.thenflo.ai/v1";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function getAccessToken() {
  return localStorage.getItem("tf-access-token");
}

function getRefreshToken() {
  return localStorage.getItem("tf-refresh-token");
}

function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem("tf-access-token", accessToken);
  if (refreshToken) localStorage.setItem("tf-refresh-token", refreshToken);
}

function clearTokens() {
  localStorage.removeItem("tf-access-token");
  localStorage.removeItem("tf-refresh-token");
}

let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    })
      .then((res) => {
        if (!res.ok) throw new ApiError("Session expired", res.status);
        return res.json();
      })
      .then((data) => {
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Low-level request helper used by every service module.
 * @param {string} path - path relative to BASE_URL, e.g. "/sessions"
 * @param {RequestInit & { params?: Record<string,string> }} options
 */
export async function request(path, options = {}) {
  const { params, headers, ...rest } = options;
  const url = new URL(BASE_URL + path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }

  const token = getAccessToken();
  const doFetch = (bearer) =>
    fetch(url.toString(), {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
        ...headers,
      },
    });

  let res = await doFetch(token);

  if (res.status === 401 && getRefreshToken()) {
    try {
      const newToken = await refreshAccessToken();
      res = await doFetch(newToken);
    } catch {
      clearTokens();
      window.location.assign("/login");
      throw new ApiError("Session expired", 401);
    }
  }

  if (!res.ok) {
    let details;
    try {
      details = await res.json();
    } catch {
      details = null;
    }
    throw new ApiError(details?.message || `Request failed (${res.status})`, res.status, details);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const apiClient = {
  get: (path, params) => request(path, { method: "GET", params }),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export const tokenStore = { getAccessToken, getRefreshToken, setTokens, clearTokens };

export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? "true") === "true";
