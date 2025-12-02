// import { API_URL } from "./App";

// // Generic GET
// export async function apiGet(path) {
//   const res = await fetch(`${API_URL}${path}`);
//   if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
//   return res.json();
// }

// // Generic JSON POST
// export async function apiPost(path, data) {
//   const res = await fetch(`${API_URL}${path}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
//   return res.json();
// }

// // Generic JSON PUT
// export async function apiPut(path, data) {
//   const res = await fetch(`${API_URL}${path}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
//   return res.json();
// }

// // File upload (for profile picture)
// export async function apiUploadPicture(file) {
//   const formData = new FormData();
//   formData.append("picture", file);

//   const res = await fetch(`${API_URL}/user/picture`, {
//     method: "POST",
//     body: formData,
//   });
//   if (!res.ok) throw new Error(`POST /user/picture failed: ${res.status}`);
//   return res.json();
// }

// src/api.js
import { API_URL } from "./App";

// GET stays the same
export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

// POST (ideally using relaxed version as I showed before, but core idea is same)
export async function apiPost(path, data) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    return (
      json || {
        success: false,
        error: `POST ${path} failed with status ${res.status}`,
      }
    );
  }

  return json;
}

// PUT stays the same
export async function apiPut(path, data) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

// Add these helpers if you don't already have them:
export async function apiLogin(username, password) {
  return apiPost("/auth/login", { username, password });
}

export async function apiRegister(payload) {
  return apiPost("/auth/register", payload);
}

// IMPORTANT: send user_id
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
