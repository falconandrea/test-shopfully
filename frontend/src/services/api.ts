import axios from 'axios';

/**
 * Centralised Axios instance for all API calls (RF9).
 *
 * Base URL is read from the VITE_API_BASE_URL environment variable,
 * falling back to http://localhost:8000/api in development.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
