import axios from 'axios';

/* Placeholder only — Part 2 wires the base URL, auth header and error
   interceptor. Nothing in Part 1 issues an HTTP call through this. */
export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 20_000,
});
