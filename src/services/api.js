/**
 * @fileoverview Global Axios API Configuration.
 * Creates a centralized Axios instance to communicate with the backend.
 * Handles base URLs, HTTP-Only cookie credentials, and global error interception (like expired sessions).
 */

import axios from 'axios';

/**
 * Centralized Axios instance.
 * Automatically attaches the `jgm_token` cookie to every request via `withCredentials: true`.
 */
const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Ensure /api/v1 is present for REST but absent for Socket
export const SOCKET_URL = RAW_BASE_URL.replace('/api/v1', '');
export const API_URL = RAW_BASE_URL.endsWith('/api/v1') ? RAW_BASE_URL : `${RAW_BASE_URL}/api/v1`;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Global Response Interceptor.
 * Listens to every response coming back from the backend.
 * If the backend returns a 401 (Unauthorized) or 403 (Forbidden), it means the JWT expired or is invalid.
 * It immediately clears the local auth state and kicks the user back to the login page.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token is invalid/expired. Wipe local state.
            localStorage.removeItem('is_customer_authenticated');
            
            // Redirect to login if they aren't already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;