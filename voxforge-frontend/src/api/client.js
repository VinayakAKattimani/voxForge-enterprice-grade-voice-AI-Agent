const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';


// --------------------------------------------------
// API REQUEST
// --------------------------------------------------

export async function apiRequest(path, options = {}) {

  const accessToken =
    window.sessionStorage.getItem(
      'voxforge-access-token'
    );

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json',
        }),
    ...(options.headers || {}),
  };


  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }


  let response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
    }
  );


  // --------------------------------------------------
  // ACCESS TOKEN EXPIRED
  // --------------------------------------------------

  if (
    response.status === 401 &&
    !path.includes('/auth/refresh') &&
    !path.includes('/auth/login') &&
    !path.includes('/auth/register')
  ) {

    const refreshToken =
      window.sessionStorage.getItem(
        'voxforge-refresh-token'
      );


    if (!refreshToken) {
      throw new Error(
        'Session expired. Please log in again.'
      );
    }


    // ----------------------------------------------
    // REQUEST NEW ACCESS TOKEN
    // ----------------------------------------------

    const refreshResponse = await fetch(
      `${API_BASE_URL}/api/v1/auth/refresh`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      }
    );


    if (!refreshResponse.ok) {

      window.sessionStorage.removeItem(
        'voxforge-access-token'
      );

      window.sessionStorage.removeItem(
        'voxforge-refresh-token'
      );

      throw new Error(
        'Session expired. Please log in again.'
      );
    }


    const refreshData =
      await refreshResponse.json();


    // ----------------------------------------------
    // STORE NEW TOKENS
    // ----------------------------------------------

    if (refreshData.access_token) {

      window.sessionStorage.setItem(
        'voxforge-access-token',
        refreshData.access_token
      );
    }


    if (refreshData.refresh_token) {

      window.sessionStorage.setItem(
        'voxforge-refresh-token',
        refreshData.refresh_token
      );
    }


    // ----------------------------------------------
    // RETRY ORIGINAL REQUEST
    // ----------------------------------------------

    const retryHeaders = {
      ...(options.body instanceof FormData
        ? {}
        : {
            'Content-Type': 'application/json',
          }),
      ...(options.headers || {}),
      Authorization:
        `Bearer ${refreshData.access_token}`,
    };


    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        headers: retryHeaders,
      }
    );
  }


  // --------------------------------------------------
  // RESPONSE
  // --------------------------------------------------

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