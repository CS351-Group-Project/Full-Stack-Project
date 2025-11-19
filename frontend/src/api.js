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


// File upload (for profile picture)
export async function apiUploadPicture(file) {
  const formData = new FormData();
  formData.append("picture", file);

  const res = await fetch(`${API_URL}/user/picture`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`POST /user/picture failed: ${res.status}`);
  return res.json();
}
