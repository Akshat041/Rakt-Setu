export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  let data = null;

  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error("The server returned an unexpected response.");
    }
  }

  if (!response.ok) {
    const error = new Error(data?.error || "The request could not be completed.");
    error.status = response.status;
    error.details = data?.errors || null;
    throw error;
  }

  return data;
}
