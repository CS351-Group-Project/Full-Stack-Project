// src/api.js
import { API_URL } from "./App";

// Generic GET
export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

// Generic JSON POST
export async function apiPost(path, data) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

// Generic JSON PUT
export async function apiPut(path, data) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

// Auth helpers
export async function login(username, password) {
  // POST /api/auth/login
  return apiPost("/auth/login", { username, password });
}

// src/api.js

export async function register(username, password, extra = {}) {
  return apiPost("/auth/register", {
    username,
    password,
    ...extra,
  });
}


// File upload (for profile picture) – now takes userId
export async function apiUploadPicture(file, userId) {
  const formData = new FormData();
  formData.append("picture", file);
  formData.append("user_id", String(userId));

  const res = await fetch(`${API_URL}/user/picture`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`POST /user/picture failed: ${res.status}`);
  return res.json();
}
