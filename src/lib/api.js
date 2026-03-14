// Central API helper — all fetch calls to the backend go through here
import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Wrapper around fetch that:
 * - Prepends the API base URL
 * - Sets JSON Content-Type on non-GET requests
 * - Automatically attaches the Firebase ID token (Bearer) if user is signed in
 * - Returns parsed JSON
 * @param {string} path - e.g. "/api/consultations"
 * @param {RequestInit} [options]
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const isBodyMethod =
    options.method === "POST" ||
    options.method === "PUT" ||
    options.method === "DELETE";

  // Automatically attach Firebase ID token if user is signed in
  let authHeader = {};
  try {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      authHeader = { Authorization: `Bearer ${token}` };
    }
  } catch {
    // If token fetch fails, proceed without auth header
  }

  const headers = {
    ...(isBodyMethod && options.body
      ? { "Content-Type": "application/json" }
      : {}),
    ...authHeader,
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API error ${res.status}: ${errText}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export default apiFetch;
