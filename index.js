import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

const CF_API_KEY = process.env.CURSEFORGE_API_KEY;

app.get("/mods/:projectId/files/:fileId/download-url", async (req, res) => {
    const { projectId, fileId } = req.params;

    const url = `https://api.curseforge.com/v1/mods/${projectId}/files/${fileId}/download-url`;

    const resp = await fetch(url, {
        headers: {
            "x-api-key": CF_API_KEY
        }
    });

    if (!resp.ok) {
        const text = await resp.text();
        return res.status(resp.status).send("error from CF: " + text);
    }

    const data = await resp.json();
    return res.json(data);
});

app.get("/", (req, res) => {
    res.send("CF proxy online");
});

app.listen(PORT, () => console.log("Server running on " + PORT));
