import { getStore } from "@netlify/blobs";

const types = { html: "text/html; charset=utf-8", js: "text/javascript; charset=utf-8", mjs: "text/javascript; charset=utf-8", css: "text/css; charset=utf-8", json: "application/json", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml", mp3: "audio/mpeg", ogg: "audio/ogg", wav: "audio/wav", wasm: "application/wasm", txt: "text/plain; charset=utf-8" };
const contentType = (path) => types[path.split(".").pop().toLowerCase()] || "application/octet-stream";

export default async (request) => {
  const url = new URL(request.url);
  const slug = (url.searchParams.get("slug") || "").replace(/[^a-z0-9-]/gi, "");
  const path = (url.searchParams.get("path") || "index.html").replaceAll("\\", "/").replace(/^\/+/, "");
  if (!slug || path.includes("..")) return new Response("Not found", { status: 404 });
  const data = await getStore("playorbit-games").get(`game:${slug}:${path}`, { type: "arrayBuffer" });
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(data, { headers: { "Content-Type": contentType(path), "Cache-Control": path === "index.html" ? "no-cache" : "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
};
