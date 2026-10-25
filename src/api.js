const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function fetchUsers() {
  const response = await fetch(`${API_URL}/api/users/`);
  if (!response.ok) {
    throw new Error(`Błąd HTTP! Stan: ${response.status}`);
  }
  return await response.json();
}