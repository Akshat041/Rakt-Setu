import cors from "cors";
import express from "express";
import { mapDonorRow, openDatabase } from "./database.js";
import { VALID_BLOOD_GROUPS } from "./data/donors.js";

export function createApp() {
  const app = express();
  const database = openDatabase();

  app.use(cors());
  app.use(express.json({ limit: "16kb" }));

  app.get("/api/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      message: "RaktSetu backend is running",
      service: "RaktSetu API",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/donors", (request, response) => {
    const { bloodGroup, city, locality, available } = request.query;

    if (bloodGroup && !VALID_BLOOD_GROUPS.includes(bloodGroup)) {
      return response.status(400).json({
        error: "Invalid blood group.",
        validBloodGroups: VALID_BLOOD_GROUPS,
      });
    }

    if (available !== undefined && available !== "true" && available !== "false") {
      return response.status(400).json({
        error: "The available filter must be true or false.",
      });
    }

    const conditions = [];
    const parameters = [];

    if (bloodGroup) {
      conditions.push("blood_group = ?");
      parameters.push(bloodGroup);
    }
    if (city) {
      conditions.push("LOWER(city) LIKE LOWER(?)");
      parameters.push(`%${String(city).trim()}%`);
    }
    if (locality) {
      conditions.push("LOWER(locality) LIKE LOWER(?)");
      parameters.push(`%${String(locality).trim()}%`);
    }
    if (available !== undefined) {
      conditions.push("available = ?");
      parameters.push(available === "true" ? 1 : 0);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = database
      .prepare(`SELECT * FROM donors ${whereClause} ORDER BY id ASC`)
      .all(...parameters);
    const results = rows.map(mapDonorRow);

    response.status(200).json({
      count: results.length,
      donors: results,
    });
  });

  app.post("/api/donors", (request, response) => {
    const { name, bloodGroup, city, locality, phone, available, consent } = request.body ?? {};
    const errors = {};

    if (typeof name !== "string" || !name.trim()) errors.name = "Name is required.";
    if (!VALID_BLOOD_GROUPS.includes(bloodGroup)) {
      errors.bloodGroup = "Blood group must be one of the valid 8 groups.";
    }
    if (typeof city !== "string" || !city.trim()) errors.city = "City is required.";
    if (typeof locality !== "string" || !locality.trim()) errors.locality = "Locality is required.";
    if (typeof available !== "boolean") errors.available = "Availability must be true or false.";
    if (consent !== true) errors.consent = "Consent must be true to register.";

    if (typeof phone !== "string" || !phone.trim()) {
      errors.phone = "Phone number is required.";
    } else {
      const normalizedPhone = phone.replace(/[\s()+\-]/g, "");
      const indianNumber = normalizedPhone.startsWith("91")
        ? normalizedPhone.slice(2)
        : normalizedPhone.startsWith("0")
          ? normalizedPhone.slice(1)
          : normalizedPhone;

      if (!/^[6-9]\d{9}$/.test(indianNumber)) {
        errors.phone = "Enter a valid 10-digit Indian phone number.";
      }
    }

    if (Object.keys(errors).length > 0) {
      return response.status(400).json({
        error: "Invalid donor registration.",
        errors,
      });
    }

    const createdAt = new Date().toISOString();
    const insert = database.prepare(`
      INSERT INTO donors
        (name, blood_group, city, locality, phone, available, consent, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `);
    const result = insert.run(
      name.trim(),
      bloodGroup,
      city.trim(),
      locality.trim(),
      phone.trim(),
      available ? 1 : 0,
      createdAt,
    );
    const createdDonor = mapDonorRow(
      database.prepare("SELECT * FROM donors WHERE id = ?").get(result.lastInsertRowid),
    );

    response.status(201).json({
      message: "Donor registered successfully.",
      donor: createdDonor,
    });
  });

  app.use((request, response) => {
    response.status(404).json({
      error: "Not found.",
      path: request.originalUrl,
    });
  });

  app.use((error, _request, response, _next) => {
    if (error instanceof SyntaxError && "body" in error) {
      return response.status(400).json({
        error: "Invalid JSON request body.",
      });
    }

    console.error(error);
    response.status(500).json({
      error: "Internal server error.",
    });
  });

  return app;
}
