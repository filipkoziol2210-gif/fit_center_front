const BACKEND_ORIGIN = (
  process.env.DJANGO_API_URL ||
  "https://fit-center-u3un.onrender.com"
).replace(/\/+$/, "");

const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "content-type",
  "cookie",
  "origin",
  "referer",
  "user-agent",
  "x-csrftoken",
  "x-requested-with",
];

const FORWARDED_RESPONSE_HEADERS = [
  "cache-control",
  "content-disposition",
  "content-language",
  "content-type",
  "expires",
  "last-modified",
  "location",
  "pragma",
  "vary",
  "www-authenticate",
];

async function readRequestBody(req) {
  if (["GET", "HEAD"].includes(req.method)) {
    return undefined;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(
      Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    );
  }

  return chunks.length ? Buffer.concat(chunks) : undefined;
}

async function proxyToDjango(req, res) {
  try {
    const incoming = new URL(
      req.url || "/",
      "https://vercel.local"
    );

    const rawPath = req.query?._proxyPath;

    const path = Array.isArray(rawPath)
      ? rawPath.join("/")
      : rawPath;

    if (
      typeof path !== "string" ||
      !path ||
      path.includes("..") ||
      path.includes("\\")
    ) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: false,
        error: "Nieprawidłowa ścieżka API.",
      }));
      return;
    }

    const normalizedPath = path.replace(/^\/+|\/+$/g, "");

    incoming.searchParams.delete("_proxyPath");

    const upstreamUrl =
      `${BACKEND_ORIGIN}/api/${normalizedPath}/${incoming.search}`;

    const headers = new Headers();

    for (const name of FORWARDED_REQUEST_HEADERS) {
      const value = req.headers[name];

      if (value !== undefined) {
        headers.set(
          name,
          Array.isArray(value) ? value.join(", ") : value
        );
      }
    }

    const body = await readRequestBody(req);

    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
    });

    res.statusCode = upstream.status;
    res.setHeader("Cache-Control", "no-store");

    for (const name of FORWARDED_RESPONSE_HEADERS) {
      const value = upstream.headers.get(name);

      if (value !== null) {
        res.setHeader(name, value);
      }
    }

    const cookies =
      typeof upstream.headers.getSetCookie === "function"
        ? upstream.headers.getSetCookie()
        : [];

    if (cookies.length) {
      res.setHeader("Set-Cookie", cookies);
    }

    const responseBody = Buffer.from(
      await upstream.arrayBuffer()
    );

    res.end(responseBody);

  } catch (error) {
    console.error("Django proxy error:", error);

    res.statusCode = 502;
    res.setHeader(
      "Content-Type",
      "application/json; charset=utf-8"
    );
    res.setHeader("Cache-Control", "no-store");

    res.end(JSON.stringify({
      success: false,
      error: "Nie można połączyć się z backendem Django.",
    }));
  }
}

module.exports = { proxyToDjango };