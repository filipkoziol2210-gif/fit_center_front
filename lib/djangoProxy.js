async function proxyToDjango(req, res) {
  try {
    const incoming = new URL(req.url || "/", "https://vercel.local");

    const rawPath = req.query?._proxyPath;
    const path = Array.isArray(rawPath)
      ? rawPath.join("/")
      : rawPath;

    if (
      typeof path !== "string" ||
      !path ||
      path.includes("..") ||
      path.startsWith("/")
    ) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({
        success: false,
        error: "Nieprawidłowa ścieżka API.",
      }));
      return;
    }

    incoming.searchParams.delete("_proxyPath");

    const upstreamUrl =
      `${BACKEND_ORIGIN}/api/${path}${incoming.search}`;

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

    let cookies = [];

    if (typeof upstream.headers.getSetCookie === "function") {
      cookies = upstream.headers.getSetCookie();
    } else {
      const cookie = upstream.headers.get("set-cookie");
      if (cookie) cookies = [cookie];
    }

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
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");

    res.end(JSON.stringify({
      success: false,
      error: "Nie można połączyć się z backendem Django.",
    }));
  }
}