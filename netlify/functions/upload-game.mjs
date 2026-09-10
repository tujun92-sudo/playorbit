import JSZip from "jszip";
import { getStore } from "@netlify/blobs";

const MAX_BYTES = 60 * 1024 * 1024;
const safeSlug = (value) => value.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "");
const safePath = (value) => value.replaceAll("\\", "/").replace(/^\/+/, "");

export default async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!process.env.UPLOAD_TOKEN || request.headers.get("authorization") !== `Bearer ${process.env.UPLOAD_TOKEN}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get("archive");
  const slug = safeSlug(String(form.get("slug") || ""));
  if (!(file instanceof File) || !slug) return Response.json({ error: "A ZIP file and URL slug are required." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "The compressed file is limited to 60 MB." }, { status: 413 });
  let zip;
  try { zip = await JSZip.loadAsync(await file.arrayBuffer()); } catch { return Response.json({ error: "Invalid ZIP archive." }, { status: 400 }); }
  const entries = Object.values(zip.files).filter((entry) => !entry.dir);
  if (!zip.file("index.html")) return Response.json({ error: "The ZIP root must contain index.html." }, { status: 400 });
  if (entries.length > 1200) return Response.json({ error: "Too many files in archive." }, { status: 400 });
  const store = getStore("playorbit-games");
  const files = [];
  for (const entry of entries) {
    const path = safePath(entry.name);
    if (!path || path.includes("../") || path.startsWith("/")) return Response.json({ error: "Invalid file path in archive." }, { status: 400 });
    const bytes = await entry.async("uint8array");
    await store.set(`game:${slug}:${path}`, bytes);
    files.push(path);
  }
  await store.setJSON(`manifest:${slug}`, { slug, name: String(form.get("name") || slug), uploadedAt: new Date().toISOString(), files });
  return Response.json({ ok: true, slug, url: `/games/${slug}/` });
};
