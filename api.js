  //   // src/api.js
  // const API_URL = "http://10.45.162.126:4000"; // replace with your backend

  // export async function api(path, method = "GET", body = null, token = null) {
  //   const headers = { "Content-Type": "application/json" };
  //   if (token) headers.Authorization = `Bearer ${token}`;

  //   const res = await fetch(`${API_URL}${path}`, {
  //     method,
  //     headers,
  //     body: body ? JSON.stringify(body) : null,
  //   });

  //   const data = await res.json();
  //   if (!res.ok) throw new Error(data?.error || "Request failed");
  //   return data;
  // }
  


//  const API_URL = "http://:4000"; // replace with your backend IP

const API_URL = "http://10.10.55.52:4000";
// const API_URL = "http://localhost:4000";


export async function api(endpoint, method = "GET", body = null, token = null) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Network error");
  }
}
