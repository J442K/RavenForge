import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const CF_API = "https://api.curseforge.com/v1";
const CF_KEY = process.env.CF_API_KEY;
if (!CF_KEY) console.warn("[WARN] CF_API_KEY env var not set. Requests will 403.");

/** helper: call CF API and return JSON */
async function cf(path) {
  const r = await fetch(`${CF_API}${path}`, { headers: { "x-api-key": CF_KEY } });
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`CF API ${path} -> ${r.status} ${r.statusText} :: ${body}`);
  }
  return r.json();
}

/** Resolve a modpack project by slug; returns numeric projectId */
app.get("/resolve/project", async (req, res) => {
  try {
    const { slug, gameId = "432" } = req.query; // 432 = Minecraft
    if (!slug) return res.status(400).json({ error: "missing slug" });
    const j = await cf(`/mods/search?gameId=${gameId}&searchFilter=${encodeURIComponent(slug)}`);
    const hit = j?.data?.find(m => m.slug === slug || m.name?.toLowerCase() === slug?.toLowerCase());
    if (!hit) return res.status(404).json({ error: "not found", slug, dataCount: j?.data?.length ?? 0 });
    res.json({ projectId: hit.id, name: hit.name, slug: hit.slug });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/** Return downloadUrl for a *pack ZIP* (projectId = your modpack, fileId = pack file) */
app.get("/pack/file", async (req, res) => {
  try {
    const { projectId, fileId } = req.query;
    if (!projectId || !fileId) return res.status(400).json({ error: "missing projectId or fileId" });
    const j = await cf(`/mods/${projectId}/files/${fileId}`);
    const f = j?.data;
    if (!f?.downloadUrl) return res.status(502).json({ error: "no downloadUrl", file: f });
    res.json({
      projectId: Number(projectId),
      fileId: Number(fileId),
      filename: f.fileName,
      sizeBytes: f.fileLength,
      downloadUrl: f.downloadUrl
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/** Return downloadUrl for an individual *mod JAR* (projectId/fileId pair) */
app.get("/mod/file", async (req, res) => {
  try {
    const { projectId, fileId } = req.query;
    if (!projectId || !fileId) return res.status(400).json({ error: "missing projectId or fileId" });
    const j = await cf(`/mods/${projectId}/files/${fileId}`);
    const f = j?.data;
    if (!f?.downloadUrl) return res.status(502).json({ error: "no downloadUrl", file: f });
    res.json({
      projectId: Number(projectId),
      fileId: Number(fileId),
      filename: f.fileName,
      sizeBytes: f.fileLength,
      downloadUrl: f.downloadUrl
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`[RavenForge] proxy up on :${PORT}`));
