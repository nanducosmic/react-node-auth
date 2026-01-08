// src/services/api.js

// Base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Register API call
export const registerUser = async (name, email, password) => {
  return fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
};
