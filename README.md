# RavenForge CurseForge Proxy

This is a tiny Node.js web service.

Purpose:
The launcher should NEVER use the CurseForge API key directly.

Instead:
- the launcher calls THIS server
- this server calls CurseForge (using your secret CF key)
- returns the real downloadUrl back to the launcher

Same pattern used by PolyMC, Prism, GDLauncher, etc.

---

## HOW TO DEPLOY (FREE)

1) Go to https://railway.app
2) Sign in w/ GitHub
3) Create new project → Deploy from GitHub
4) Select THIS repo (the one this file is in)

When it finishes deploying:

5) Click your project → “Variables”
6) Add:

KEY: CF_API_KEY  
VALUE: <your-curseforge-api-key>

DONE.

Railway will give you a public domain like:

https://ravenforge-production.up.railway.app

---

## API ENDPOINTS

### Modpack zip
GET /pack/file?projectId=1127827&fileId=6887832

shell
Copy code

### Single mod file
GET /mod/file?projectId=<id>&fileId=<id>

pgsql
Copy code

Server responds with JSON:
{ "downloadUrl": "https://..." }

yaml
Copy code

Launcher then downloads the url directly.

---

## IMPORTANT

- Do NOT ever put the CF API key inside the launcher.
- That is why this server exists.











