import express from "express";
import cors from "cors";
import multer from "multer";
import { dirname, join } from "path";
import fs from "fs";
import archiver from "archiver";
import http from "http";
import logger from "../../utils/logger.js";
import { fileURLToPath } from "url";
import pool from "../../db/pool.js";
import capsuleRoutes from "../../routes/capsuleRoutes.js";
import generateRoutes from "../../routes/generateRoutes.js";
import { initSocket } from "../../services/socketService.js";

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

app.get("/", (req, res) => {
  res.redirect("/capsules?limit=99");
});

app.use("/capsules", capsuleRoutes);
app.use("/capsules", generateRoutes);

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

  const capsuleCheck = await pool.query(
    "SELECT * FROM time_capsules WHERE capsule_id = $1",
    [capsuleId]
  );
  if (capsuleCheck.rows.length === 0) {
    return res.status(404).json({ error: "Capsule not found" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const fileInfos = [];

  for (const file of req.files) {
    const filePath = `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/${capsuleId}/${file.filename}`;
    const fileName = file.originalname;
    const fileType = file.mimetype;
    const fileSize = file.size;

    await pool.query(
      `INSERT INTO memories (capsule_id, file_name, file_path, file_type, file_size)
      VALUES ($1, $2, $3, $4, $5)`,
      [capsuleId, fileName, filePath, fileType, fileSize]
    );

    fileInfos.push({ fileName, filePath, fileType, fileSize });
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

initSocket(server);
