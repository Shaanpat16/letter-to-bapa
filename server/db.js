import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const DATABASE_URL = process.env.DATABASE_URL || "";
const usePostgres = /^postgres(ql)?:\/\//i.test(DATABASE_URL);

let sqlite = null;
let pgPool = null;

function nowIso() {
  return new Date().toISOString();
}

export async function initDb() {
  if (usePostgres) {
    const { default: pg } = await import("pg");
    pgPool = new pg.Pool({
      connectionString: DATABASE_URL,
      ssl: /localhost|127\.0\.0\.1/.test(DATABASE_URL)
        ? false
        : { rejectUnauthorized: false }
    });
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS letters (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        name TEXT NOT NULL DEFAULT '',
        city TEXT NOT NULL DEFAULT '',
        country TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ip_hash TEXT NOT NULL DEFAULT ''
      )
    `);
    await pgPool.query(`CREATE INDEX IF NOT EXISTS letters_created_idx ON letters (created_at DESC)`);
    return { kind: "postgres" };
  }

  const { default: Database } = await import("better-sqlite3");
  const dbPath = process.env.DATABASE_PATH || path.join(root, "data", "letters.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      ip_hash TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS letters_created_idx ON letters (created_at DESC);
  `);
  return { kind: "sqlite", path: dbPath };
}

export async function insertLetter({ message, name, city, country, ipHash }) {
  if (pgPool) {
    const res = await pgPool.query(
      `INSERT INTO letters (message, name, city, country, ip_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [message, name, city, country, ipHash]
    );
    const row = res.rows[0];
    return { id: Number(row.id), createdAt: row.created_at };
  }
  const info = sqlite
    .prepare(
      `INSERT INTO letters (message, name, city, country, created_at, ip_hash)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(message, name, city, country, nowIso(), ipHash);
  return { id: Number(info.lastInsertRowid), createdAt: nowIso() };
}

export async function countLetters() {
  if (pgPool) {
    const res = await pgPool.query(`SELECT COUNT(*)::int AS n FROM letters`);
    return res.rows[0].n;
  }
  return sqlite.prepare(`SELECT COUNT(*) AS n FROM letters`).get().n;
}

export async function recentPublic(limit = 24) {
  if (pgPool) {
    const res = await pgPool.query(
      `SELECT id, message, city, country, created_at
       FROM letters
       ORDER BY id DESC
       LIMIT $1`,
      [limit]
    );
    return res.rows.map(publicRow);
  }
  return sqlite
    .prepare(
      `SELECT id, message, city, country, created_at
       FROM letters
       ORDER BY id DESC
       LIMIT ?`
    )
    .all(limit)
    .map(publicRow);
}

export async function allLettersAdmin() {
  if (pgPool) {
    const res = await pgPool.query(
      `SELECT id, message, name, city, country, created_at
       FROM letters
       ORDER BY id ASC`
    );
    return res.rows.map(adminRow);
  }
  return sqlite
    .prepare(
      `SELECT id, message, name, city, country, created_at
       FROM letters
       ORDER BY id ASC`
    )
    .all()
    .map(adminRow);
}

export async function deleteLetter(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) return false;
  if (pgPool) {
    const res = await pgPool.query(`DELETE FROM letters WHERE id = $1`, [n]);
    return res.rowCount > 0;
  }
  const info = sqlite.prepare(`DELETE FROM letters WHERE id = ?`).run(n);
  return info.changes > 0;
}

export async function resetLetters() {
  if (pgPool) {
    await pgPool.query(`TRUNCATE letters RESTART IDENTITY`);
    return;
  }
  sqlite.exec(`DELETE FROM letters; DELETE FROM sqlite_sequence WHERE name = 'letters';`);
}

function publicRow(row) {
  return {
    id: Number(row.id),
    message: row.message,
    city: row.city || "",
    country: row.country || "",
    createdAt: row.created_at
  };
}

function adminRow(row) {
  return {
    id: Number(row.id),
    message: row.message,
    name: row.name || "",
    city: row.city || "",
    country: row.country || "",
    createdAt: row.created_at
  };
}
