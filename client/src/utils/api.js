// src/utils/api.js
const API = "https://disasterlist-backend.onrender.com";

export async function fetchWithToken(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem("token");
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...(body && { body: JSON.stringify(body) })
  };

  const res = await fetch(`${API}${endpoint}`, options);
  return res.json();
}
