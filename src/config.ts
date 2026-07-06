/// <reference types="vite/client" />

// Central place for the backend base URL.
//
// Locally: falls back to http://localhost:5000 automatically.
// In production: set VITE_API_URL in your deployment platform's environment
// variables (e.g. Vercel project settings) to your deployed backend's URL,
// e.g. https://skillmatch-api.onrender.com
//
// Vite only exposes env vars prefixed with VITE_ to the browser, and they
// must be set at build time (not just at runtime).
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
