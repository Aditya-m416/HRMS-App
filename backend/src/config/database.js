import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', '..', 'data');
const dbPath = process.env.DATABASE_URL || join(dataDir, 'nexushr.sqlite');

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');

export function migrate() {
  const schema = readFileSync(join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  db.exec(schema);
}

export function all(sql, params = {}) {
  const statement = db.prepare(sql);
  return Array.isArray(params) ? statement.all(...params) : statement.all(params);
}

export function get(sql, params = {}) {
  const statement = db.prepare(sql);
  return Array.isArray(params) ? statement.get(...params) : statement.get(params);
}

export function run(sql, params = {}) {
  const statement = db.prepare(sql);
  return Array.isArray(params) ? statement.run(...params) : statement.run(params);
}

export function transaction(fn) {
  db.exec('BEGIN');
  try {
    const value = fn();
    db.exec('COMMIT');
    return value;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function parseJson(value, fallback) {
  if (value == null || value === '') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function toJson(value) {
  return JSON.stringify(value ?? []);
}

export function nextId(prefix, table) {
  const row = get(
    `SELECT id FROM ${table} WHERE id LIKE ? ORDER BY CAST(SUBSTR(id, ?) AS INTEGER) DESC LIMIT 1`,
    [`${prefix}%`, prefix.length + 1]
  );
  const next = row ? Number(row.id.slice(prefix.length)) + 1 : 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

export { dbPath };
