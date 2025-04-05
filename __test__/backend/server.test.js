import supertest from "supertest";
import app from "@/pages/api/server.js";

describe("Time Capsules API", () => {
  test("GET /capsules should return all capsules", async () => {
    const response = await supertest(app).get("/capsules");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  test("GET /capsules with search should filter correctly", async () => {
    const response = await supertest(app).get("/capsules?search=Example Title");
    expect(response.status).toBe(200);
    expect(
      response.body.every((capsule) =>
        capsule.title.toLowerCase().includes("example title")
      )
    ).toBe(true);
  });

  test("GET /capsules with status filter should return only matching capsules", async () => {
    const response = await supertest(app).get("/capsules?status=Locked");
    expect(response.status).toBe(200);
    expect(response.body.every((capsule) => capsule.status === "Locked")).toBe(
      true
    );
  });

  test("GET /capsules should return capsules sorted by date", async () => {
    const response = await supertest(app).get("/capsules?sort=asc");
    expect(response.status).toBe(200);
    expect(response.body[0].date <= response.body[1].date).toBe(true); // Check ascending order
  });

  test("GET /capsule/:id should return the correct capsule", async () => {
    const response = await supertest(app).get("/capsule/1");
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1); // Replace with an actual ID from your mock data
  });

  test("GET /capsule/:id should return 404 if capsule not found", async () => {
    const response = await supertest(app).get("/capsule/999"); // Assume 999 doesn't exist
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Capsule not found");
  });

  test("POST /capsules should create a new capsule", async () => {
    const newCapsule = {
      title: "New Capsule",
      date: "2025-12-31",
      status: "Locked",
      description: "This is a new time capsule",
    };
    const response = await supertest(app).post("/capsules").send(newCapsule);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newCapsule.title);
  });

  test("POST /capsules should return 400 if required fields are missing", async () => {
    const newCapsule = { title: "New Capsule" }; // Missing other fields
    const response = await supertest(app).post("/capsules").send(newCapsule);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("All fields are required");
  });
  test("PUT /capsule/:id should update the capsule", async () => {
    const updatedCapsule = {
      title: "Updated Capsule",
      date: "2025-01-01",
      status: "Locked",
      description: "Updated description",
    };
    const response = await supertest(app)
      .put("/capsule/1")
      .send(updatedCapsule); // Replace with actual ID
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedCapsule.title);
  });

  test("PUT /capsule/:id should return 404 if capsule not found", async () => {
    const updatedCapsule = {
      title: "Updated Capsule",
      date: "2025-01-01",
      status: "Locked",
      description: "Updated description",
    };
    const response = await supertest(app)
      .put("/capsule/999")
      .send(updatedCapsule); // Non-existing ID
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Capsule not found");
  });
  test("DELETE /capsules/:id should delete a capsule", async () => {
    const response = await supertest(app).delete("/capsules/1"); // Replace with an actual ID
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Capsule deleted successfully");
  });

  test("DELETE /capsules/:id should return 404 if capsule not found", async () => {
    const response = await supertest(app).delete("/capsules/999"); // Non-existing ID
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Capsule not found");
  });
});
