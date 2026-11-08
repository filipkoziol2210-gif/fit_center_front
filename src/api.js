// Produkcyjnie /api jest proxyowane przez Vercel do Django na Render.
// Lokalnie Create React App używa pola "proxy" w package.json.
const API_BASE = "";

let csrfToken = null;
let csrfRequest = null;

async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;

  if (!csrfRequest) {
    csrfRequest = fetch(`${API_BASE}/api/csrf/`, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        let data;
        try {
          data = await response.json();
        } catch {
          throw new Error(`Endpoint CSRF zwrócił nieprawidłową odpowiedź (${response.status}).`);
        }

        if (!response.ok) {
          throw new Error(data.error || `Nie udało się pobrać CSRF (${response.status}).`);
        }
        if (!data.csrfToken) {
          throw new Error("Backend nie zwrócił tokenu CSRF. Sprawdź api_csrf w Django.");
        }

        csrfToken = data.csrfToken;
        return csrfToken;
      })
      .finally(() => {
        csrfRequest = null;
      });
  }

  return csrfRequest;
}

export async function apiRequest(path, options = {}) {
  if (typeof path !== "string" || !path.startsWith("/api/")) {
    throw new Error("Ścieżka API musi zaczynać się od /api/.");
  }

  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});

  if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    const token = await ensureCsrfToken();
    headers.set("X-CSRFToken", token);
  }

  headers.set("Accept", "application/json");

  return fetch(`${API_BASE}${path}`, {
    ...options,
    method,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });
}

export async function apiJson(path, options = {}) {
  const response = await apiRequest(path, options);
  const raw = await response.text();
  let data = {};

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      const title = raw.match(/<title[^>]*>(.*?)<\/title>/i)?.[1];
      throw new Error(
        title
          ? `Serwer zwrócił HTML zamiast JSON: ${title} (HTTP ${response.status}).`
          : `Serwer zwrócił nieprawidłową odpowiedź (HTTP ${response.status}).`
      );
    }
  }

  if (!response.ok) {
    throw new Error(data.error || `Błąd serwera (${response.status}).`);
  }

  return data;
}

export function jsonBody(value) {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  };
}
