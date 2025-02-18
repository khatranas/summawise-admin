import axios from 'axios';
import { Cookies } from 'react-cookie';

// Create a cookies instance
const cookies = new Cookies();


const axiosService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookies.get('accessToken')}`,
  },
});


axiosService.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an unauthorized (401) response
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Get the refresh token from the cookie
      const refreshToken = cookies.get('refreshToken');

      // Use your API endpoint to refresh the token
      try {
        const response = await axios.get(
          // `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/sso-service/api/auth/refresh-token`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        // Update the access token in the cookie
        const newAccessToken = "accessToken"
        if (newAccessToken) {
          cookies.set('accessTokenKforce', newAccessToken, { path: '/' }); // Set new access token

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return await axiosService(originalRequest);
        } else {
          clearUserSession();
        }
      } catch {
        clearUserSession();
      }
    }

    return await Promise.reject(error);
  }
);

// Helper function to clear user session and cookies
function clearUserSession() {
  localStorage?.clear();
  ['refreshToken', 'accessToken'].forEach((key) => cookies.remove(key, { path: '/' }));
}

export default axiosService;
