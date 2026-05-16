import axios from 'axios';

// When deployed to Vercel, it will use the environment variable.
// When running locally, it will default to localhost.
const api = axios.create({
  baseURL: 'https://sj-backend-api.loca.lt',
  headers: {
    'Bypass-Tunnel-Reminder': 'true'
  }
});

export default api;
