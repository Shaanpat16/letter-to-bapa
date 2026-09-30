# Pratyaksh — Letter to Bapa

A full recreation of [msm93.org](https://msm93.org/): write a short letter to Mahant Swami Maharaj for his 93rd Janma Jayanti Mahotsav at OVO Arena, Wembley on Sunday 4 October 2026.

Letters are stored in a real database. After send, the letter flies across a map to London, where Swamishri is now.

## Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API runs on port 3001; the site proxies `/api` through Vite.

Production-style (build + one Node process):

```bash
npm run build
npm start
```

Then open [http://localhost:3001](http://localhost:3001).

## What you get

- **Public site** — ceremonial letter form, live count, recent messages (city only, never names)
- **Send-off** — the letter travels to OVO Arena, Wembley
- **Keepsake card** — save or share a PNG of your letter
- **Admin** — [http://localhost:5173/admin](http://localhost:5173/admin) with `ADMIN_KEY` from `.env`
- **CSV export** — `/api/admin/export.csv?key=YOUR_KEY` for offering letters at Wembley
- **iPhone + desktop** — large tap targets, safe-area padding, 16px inputs so iOS does not zoom

## Backend

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Render health check |
| GET | `/api/stats` | Total count + recent public examples |
| POST | `/api/message` | Save a letter (`message`, optional `name`, `city`, `country`) |
| GET | `/api/admin/letters` | Full list with names (`x-admin-key`) |
| GET | `/api/admin/export.csv` | Spreadsheet for printing |

Locally this uses SQLite at `data/letters.db`. On Render, set `DATABASE_URL` and it uses Postgres instead (the filesystem is ephemeral there).

## Deploy on Render

`render.yaml` defines a web service and Postgres. Set `ADMIN_KEY` in the dashboard after the first deploy. The process binds to `0.0.0.0:$PORT`.
