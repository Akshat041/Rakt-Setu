import cors from "cors";
import express from "express";
import { mockDonors, VALID_BLOOD_GROUPS } from "./data/donors.js";

export function createApp() {
  const app = express();
  const donors = mockDonors.map((donor) => ({ ...donor }));
  let nextDonorId = Math.max(...donors.map((donor) => donor.id)) + 1;

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

    const partialMatch = (value, filter) =>
      String(value).toLowerCase().includes(String(filter).trim().toLowerCase());

    const results = donors.filter((donor) => {
      if (bloodGroup && donor.bloodGroup !== bloodGroup) return false;
      if (city && !partialMatch(donor.city, city)) return false;
      if (locality && !partialMatch(donor.locality, locality)) return false;
      if (available !== undefined && donor.available !== (available === "true")) return false;
      return true;
    });

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

    const createdDonor = {
      id: nextDonorId++,
      name: name.trim(),
      bloodGroup,
      city: city.trim(),
      locality: locality.trim(),
      phone: phone.trim(),
      available,
      consent: true,
      createdAt: new Date().toISOString(),
    };

    donors.push(createdDonor);

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
