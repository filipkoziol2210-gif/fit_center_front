/**
 * Wspólny klient API.
 * W przeglądarce wszystkie żądania idą pod tym samym originem (/api/...):
 * - produkcja: proxy Vercel z vercel.json -> Render
 * - lokalnie: proxy Create React App z package.json -> Render lub lokalny Django
 * Dzięki temu cookies sesji i CSRF są first-party.
 */

const API_BASE_URL = ""; // Wymuszamy same-origin przez proxy Vercel/CRA.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS", "TRACE"]);

let csrfToken = null;
let csrfRequest = null;

function buildUrl(path) {
  if (typeof path !== "string" || !path.startsWith("/api/")) {
    throw new Error("Adres API musi zaczynać się od /api/.");
  }
  return `${API_BASE_URL}${path}`;
}

async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      throw new Error("Serwer zwrócił niepoprawny JSON.");
    }
  }

  const text = await response.text();
  return { rawResponse: text };
}

async function ensureCsrfToken(forceRefresh = false) {
  if (forceRefresh) csrfToken = null;
  if (csrfToken) return csrfToken;

  if (!csrfRequest) {
    csrfRequest = fetch(buildUrl("/api/csrf/"), {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await readResponse(response);
        if (!response.ok) {
          throw new Error(data.error || `Nie udało się pobrać CSRF (${response.status}).`);
        }
        if (!data.csrfToken) {
          throw new Error("Backend nie zwrócił tokenu CSRF.");
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

export function clearCsrfToken() {
  csrfToken = null;
  csrfRequest = null;
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});

  if (!SAFE_METHODS.has(method)) {
    const token = await ensureCsrfToken();
    headers.set("X-CSRFToken", token);
  }

  headers.set("Accept", "application/json");

  return fetch(buildUrl(path), {
    ...options,
    method,
    headers,
    credentials: "include",
    cache: options.cache || "no-store",
  });
}

export async function apiJson(path, options = {}) {
  const response = await apiRequest(path, options);
  const data = await readResponse(response);

  if (!response.ok) {
    if (response.status === 403 && data.rawResponse) {
      throw new Error(
        "Django odrzucił żądanie (403). Sprawdź token CSRF, cookie i konfigurację proxy."
      );
    }
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
