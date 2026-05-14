import { get, parseJson } from '../config/database.js';

export function findReference(key, fallback = null) {
  const row = get('SELECT payload FROM reference_data WHERE key = ?', [key]);
  return row ? parseJson(row.payload, fallback) : fallback;
}
