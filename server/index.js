import "./env.js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { initDb, insertLetter, countLetters, recentPublic, allLettersAdmin, deleteLetter, resetLetters } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const PORT = Number(process.env.PORT) || 3001;
const HOST = "0.0.0.0";
const ADMIN_KEY = process.env.ADMIN_KEY || "";
const IP_SALT = process.env.IP_SALT || "pratyaksh-93";
const CLOSES_AT = process.env.CLOSES_AT ? new Date(process.env.CLOSES_AT) : null;

const hits = new Map();
const MAX_PER_HOUR = 24;

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = (typeof forwarded === "string" ? forwarded.split(",")[0] : "") || req.ip || "";
  return raw.trim();
}

function ipHash(ip) {
  return crypto.createHash("sha256").update(`${IP_SALT}:${ip}`).digest("hex").slice(0, 20);
}

function rateOk(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (list.length >= MAX_PER_HOUR) {
    hits.set(ip, list);
    return false;
  }
  list.push(now);
  hits.set(ip, list);
  return true;
}

function clean(value, max) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function isClosed() {
  return CLOSES_AT ? Date.now() > CLOSES_AT.getTime() : false;
}

function adminAuthorized(req) {
  if (!ADMIN_KEY) return false;
  const header = req.headers["x-admin-key"];
  const query = typeof req.query.key === "string" ? req.query.key : "";
  return header === ADMIN_KEY || query === ADMIN_KEY;
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, closed: isClosed() });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/stats", async (_req, res) => {
  try {
    const [total, examples] = await Promise.all([countLetters(), recentPublic(30)]);
    res.json({ total, examples, closed: isClosed() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "stats_failed" });
  }
});

app.post("/api/message", async (req, res) => {
  try {
    if (isClosed()) {
      return res.status(403).json({ error: "closed", message: "The offering has closed." });
    }

    const body = req.body || {};
    if (clean(body.website, 80)) {
      return res.json({ seq: 0, total: await countLetters() });
    }

    const message = clean(body.message, 300);
    const name = clean(body.name, 40);
    const city = clean(body.city, 40);
    const country = clean(body.country, 56);

    if (!message) {
      return res.status(400).json({ error: "Write your message first." });
    }
    if (/\bhttps?:\/\//i.test(message) && message.split(" ").length < 4) {
      return res.status(400).json({ error: "That did not send. Try once more." });
    }

    const ip = clientIp(req);
    if (!rateOk(ip)) {
      return res.status(429).json({ error: "Please wait a little, then try again." });
    }

    const saved = await insertLetter({
      message,
      name,
      city,
      country,
      ipHash: ipHash(ip)
    });
    const total = await countLetters();
    res.json({ seq: saved.id, total, createdAt: saved.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "That did not send. Try once more." });
  }
});

app.get("/api/admin/letters", async (req, res) => {
  if (!adminAuthorized(req)) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const rows = await allLettersAdmin();
    res.json({ total: rows.length, letters: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "export_failed" });
  }
});

app.get("/api/admin/export.csv", async (req, res) => {
  if (!adminAuthorized(req)) {
    return res.status(401).type("text").send("unauthorized");
  }
  try {
    const rows = await allLettersAdmin();
    const header = "id,created_at,name,city,country,message";
    const lines = rows.map((r) =>
      [r.id, r.createdAt, r.name, r.city, r.country, r.message].map(csvEscape).join(",")
    );
    res.setHeader("Content-Disposition", "attachment; filename=letters-to-bapa.csv");
    res.type("text/csv").send([header, ...lines].join("\n"));
  } catch (err) {
    console.error(err);
    res.status(500).type("text").send("export_failed");
  }
});

app.delete("/api/admin/letters/:id", async (req, res) => {
  if (!adminAuthorized(req)) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const ok = await deleteLetter(req.params.id);
    if (!ok) return res.status(404).json({ error: "not_found" });
    const total = await countLetters();
    res.json({ ok: true, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "delete_failed" });
  }
});

app.post("/api/admin/reset", async (req, res) => {
  if (!adminAuthorized(req)) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    await resetLetters();
    res.json({ ok: true, total: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "reset_failed" });
  }
});

const dist = path.join(root, "client", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.method !== "GET") return next();
    res.sendFile(path.join(dist, "index.html"));
  });
}

const kind = await initDb();
app.listen(PORT, HOST, () => {
  console.log(`Letter to Bapa listening on http://${HOST}:${PORT} (${kind.kind})`);
});
