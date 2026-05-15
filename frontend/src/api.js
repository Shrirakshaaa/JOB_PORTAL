import axios from 'axios';

// When deployed to Vercel, it will use the environment variable.
// When running locally, it will default to localhost.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
});

export default api;
