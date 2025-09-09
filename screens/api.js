// src/api.js
const API_URL = "http://<your-backend-0>:4000"; // replace with your backend

export async function api(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}
  