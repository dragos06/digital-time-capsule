import express from "express";
import cors from "cors";
import initialTimeCapsules from "../../data/Capsules.js";
import multer from "multer";
import { dirname, join } from "path";
import fs from "fs";
import archiver from "archiver";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import logger from "../../utils/logger.js";
import { fileURLToPath } from "url";


dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const app = express();
const server = http.createServer(app);
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const accessLogPath = join(__dirname, "./logs/access.log");

try {
  fs.writeFileSync(accessLogPath, "");
  console.log("✅ access.log cleared on server start");
} catch (err) {
  console.error("❌ Failed to clear access.log:", err);
}

app.use((req, res, next) => {
  if (req.headers["x-health-check"] === "true") {
    return next();
  }

  const userIP =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP";
  logger.info(`Access from ${userIP} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(express.json({ limit: "3gb" }));
app.use(express.urlencoded({ limit: "3gb", extended: true }));

app.use(function (req, res, next) {
  res.setTimeout(60 * 60 * 1000); // Set a timeout of 1 hour (adjust as needed)
  next();
});

//let timeCapsules = [...initialTimeCapsules];

const validateCapsule = (req, res, next) => {
  const { title, date, status, description } = req.body;

  if (!title || !date || !status || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!["Locked", "Unlocked"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Invalid status. Must be 'Locked' or 'Unlocked'." });
  }

  if (status === "Unlocked" && new Date(date) > new Date()) {
    return res.status(400).json({
      error: "Invalid status. Must be 'Locked' if date is in the future.",
    });
  }

  if (status === "Locked" && new Date(date) <= new Date()) {
    return res.status(400).json({
      error: "Invalid status. Must be 'Unlocked' if date is in the past.",
    });
  }

  if (
    isNaN(Date.parse(date)) ||
    new Date(date).toISOString().split("T")[0] !== date
  ) {
    return res.status(400).json({ error: "Invalid date format." });
  }

  next();
};

const generateRandomCapsules = (count) => {
  const statuses = ["Locked", "Unlocked"];
  let generatedCapsules = [];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date(
      status === "Locked"
        ? new Date().getTime() + Math.random() * 1000000000
        : new Date().getTime() - Math.random() * 1000000000
    )
      .toISOString()
      .split("T")[0];
    const title = `Capsule ${Math.random().toString(36).substring(7)}`;
    const description = `Description of capsule ${Math.random()
      .toString(36)
      .substring(7)}`;

    const newCapsule = {
      id: Math.max(...timeCapsules.map((c) => c.id)) + 1,
      title,
      date,
      status,
      description,
    };

    //timeCapsules.push(newCapsule);
    generatedCapsules.push(newCapsule);
  }

  return generatedCapsules;
};

// Socket.io Setup
const io = new Server(server, {
  cors: { origin: "*" },
  methods: ["GET", "POST"],
});

const getCapsuleStats = async () => {
  const result = await pool.query(`
    SELECT capsule_status, COUNT(*) AS count
    FROM time_capsules
    GROUP BY capsule_status
  `);
  const stats = { locked: 0, unlocked: 0 };
  result.rows.forEach(row => {
    if (row.status === "Locked") stats.locked += parseInt(row.count);
    if (row.status === "Unlocked") stats.unlocked += parseInt(row.count);
  });
  return stats;
};


io.on("connection", async (socket) => {
  const ip = socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;
  console.log(`New client connected: ${socket.id} | IP: ${ip}`);

  const stats = await getCapsuleStats();
  socket.emit("capsuleStats", stats);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id} | IP: ${ip}`);
  });
});


// Endpoint to generate random capsules
app.post("/capsules/generate", (req, res) => {
  const { count } = req.body;
  const generatedCapsules = generateRandomCapsules(count);

  io.emit("capsuleStats", getCapsuleStats()); // Emit stats update to all connected clients
  res.status(200).json(generatedCapsules);
});

app.get("/", (req, res) => {
  res.redirect("/capsules?limit=99");
});

//GET all capsules
app.get("/capsules", async (req, res) => {
  let {
    search = "",
    sort = "asc",
    status = "All",
    offset = 0,
    limit = 9,
  } = req.query;

  offset = parseInt(offset);
  limit = parseInt(limit);

  try {
    let query = "SELECT * FROM time_capsules WHERE 1=1";
    let values = [];

    if (search) {
      values.push(`%${search.toLocaleLowerCase()}%`);
      query += ` AND LOWER(capsule_title) LIKE $${values.length}`;
    }

    if (status === "Locked" || status === "Unlocked") {
      values.push(status);
      query += ` AND capsule_status = $${values.length}`;
    }

    query += ` ORDER BY capsule_date ${
      sort === "desc" ? "DESC" : "ASC"
    } LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    const formattedRows = result.rows.map(row => ({
      ...row,
      capsule_date: new Date(row.capsule_date).toISOString().split('T')[0],
    }));

    const countResult = await pool.query("SELECT COUNT(*) FROM time_capsules");
    const total = parseInt(countResult.rows[0].count);

    res.json({
      capsules: formattedRows,
      hasMore: offset + limit < total,
    });
  } catch (err) {
    console.error("Error fetching capsules: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a capsule by ID
app.get("/capsule/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM time_capsules WHERE capsule_id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    const formattedRows = result.rows.map(row => ({
      ...row,
      capsule_date: new Date(row.capsule_date).toISOString().split('T')[0],
    }));

    res.json(formattedRows[0]);
  } catch (err) {
    console.error("Error fetching capsule:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST - Add a new capsule
app.post("/capsules", validateCapsule, async (req, res) => {
  const { title, date, status, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO time_capsules (capsule_title, capsule_date, capsule_status, capsule_description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, date, status, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting capsule:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT - Update a capsule
app.put("/capsule/:id", validateCapsule, async (req, res) => {
  const { title, date, status, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE time_capsules
       SET capsule_title = $1, capsule_date = $2, capsule_status = $3, capsule_description = $4
       WHERE capsule_id = $5 RETURNING *`,
      [title, date, status, description, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Capsule not found" });
    
    const formattedRows = result.rows.map(row => ({
      ...row,
      capsule_date: new Date(row.capsule_date).toISOString().split('T')[0],
    }));
    
    res.json(formattedRows[0]);
  } catch (err) {
    console.error("Error updating capsule:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE - Remove a capsule
app.delete("/capsules/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM time_capsules WHERE capsule_id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Capsule not found" });

    res.json({ message: "Capsule deleted successfully" });
  } catch (err) {
    console.error("Error deleting capsule:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


const uploadDir = join("upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const capsuleId = req.params.id;
    const capsuleUploadDir = join(uploadDir, capsuleId.toString());

    if (!fs.existsSync(capsuleUploadDir)) {
      fs.mkdirSync(capsuleUploadDir, { recursive: true });
    }

    cb(null, capsuleUploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 * 3 },
});

//UPLOAD
app.post("/capsule/:id/upload", upload.array("file", 100), async (req, res) => {
  const capsuleId = parseInt(req.params.id);

  const capsuleCheck = await pool.query("SELECT * FROM time_capsules WHERE capsule_id = $1", [capsuleId]);
  if (capsuleCheck.rows.length === 0){
    return res.status(404).json({error: "Capsule not found"});
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const fileInfos = [];

  for (const file of req.files){
    const filePath = `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/${capsuleId}/${file.filename}`;
    const fileName = file.originalname;
    const fileType = file.mimetype;
    const fileSize = file.size;

    await pool.query(
      `INSERT INTO memories (capsule_id, file_name, file_path, file_type, file_size)
      VALUES ($1, $2, $3, $4, $5)`,
      [capsuleId, fileName, filePath, fileType, fileSize]
    );

    fileInfos.push({fileName, filePath, fileType, fileSize});
  }

  res.status(201).json({
    message: "Files uploaded and metadata saved successfully",
    files: fileInfos,
  });

});

app.use("/upload", express.static(uploadDir));

//DOWNLOAD
app.get("/capsule/:id/download", (req, res) => {
  const capsuleId = req.params.id;
  const capsuleUploadDir = join(uploadDir, capsuleId.toString());

  if (!fs.existsSync(capsuleUploadDir)) {
    return res.status(404).json({ error: "Capsule not found" });
  }

  const archive = archiver("zip", { zlib: { level: 9 } });

  res.setHeader("Content-Type", "application/zip");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=capsule-${capsuleId}.zip`
  );

  archive.pipe(res);

  fs.readdirSync(capsuleUploadDir).forEach((file) => {
    const filePath = join(capsuleUploadDir, file);
    if (fs.statSync(filePath).isFile()) {
      archive.file(filePath, { name: file });
    }
  });
  archive.finalize();
});

export default app;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () =>
    console.log(`Server running on ${process.env.NEXT_PUBLIC_API_BASE_URL}`)
  );
}
