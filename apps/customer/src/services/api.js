export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("duka2_token");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}