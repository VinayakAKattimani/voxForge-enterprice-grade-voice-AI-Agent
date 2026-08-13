import { apiRequest } from './client';


export async function loginRequest(email, password) {
  return apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
}


export async function registerRequest(payload) {
  return apiRequest('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


export async function refreshTokenRequest(refreshToken) {
  return apiRequest('/api/v1/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });
}


export async function logoutRequest(refreshToken) {
  return apiRequest('/api/v1/auth/logout', {
    method: 'POST',
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });
}