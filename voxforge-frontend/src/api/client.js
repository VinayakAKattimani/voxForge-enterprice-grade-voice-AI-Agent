const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function apiRequest(path, options = {}) {
  const token = window.sessionStorage.getItem('voxforge-access-token');

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Non-JSON response
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}