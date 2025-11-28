import Database from 'better-sqlite3';
import { useRuntimeConfig } from '#imports';
import fs from 'node:fs';
import path from 'node:path';

let db: import('better-sqlite3').Database;

export function useDB() {
  if (db) {
    return db;
  }

  const config = useRuntimeConfig();
  const dbPath = path.join(process.cwd(), 'server', '.data');
  const dbFile = path.join(dbPath, 'lensconnect.sqlite');

  // Ensure the directory exists
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  db = new Database(dbFile);
  
  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');

  return db;
}
