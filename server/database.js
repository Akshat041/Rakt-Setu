import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { mockDonors } from "./data/donors.js";

const serverDirectory = dirname(fileURLToPath(import.meta.url));
export const databasePath = join(serverDirectory, "data", "raktsetu.sqlite");

export function openDatabase() {
  mkdirSync(dirname(databasePath), { recursive: true });
  const database = new DatabaseSync(databasePath);

  database.exec(`
    CREATE TABLE IF NOT EXISTS donors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      blood_group TEXT NOT NULL,
      city TEXT NOT NULL,
      locality TEXT NOT NULL,
      phone TEXT NOT NULL,
      available INTEGER NOT NULL CHECK (available IN (0, 1)),
      consent INTEGER NOT NULL CHECK (consent IN (0, 1)),
      created_at TEXT NOT NULL
    );
  `);

  const count = database.prepare("SELECT COUNT(*) AS count FROM donors").get();
  if (count.count === 0) {
    const insert = database.prepare(`
      INSERT INTO donors
        (name, blood_group, city, locality, phone, available, consent, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const donor of mockDonors) {
      insert.run(
        donor.name,
        donor.bloodGroup,
        donor.city,
        donor.locality,
        donor.phone,
        donor.available ? 1 : 0,
        donor.consent ? 1 : 0,
        donor.createdAt,
      );
    }
  }

  return database;
}

export function mapDonorRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    bloodGroup: row.blood_group,
    city: row.city,
    locality: row.locality,
    phone: row.phone,
    available: Boolean(row.available),
    consent: Boolean(row.consent),
    createdAt: row.created_at,
  };
}
