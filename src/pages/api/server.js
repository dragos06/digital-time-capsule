import express from "express";
import cors from "cors";
import initialTimeCapsules from "../../data/Capsules.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import archiver from "archiver";
import dotenv from "dotenv";
import { Server } from "socket.io";
dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "3gb" }));
app.use(express.urlencoded({ limit: "3gb", extended: true }));

app.use(function (req, res, next) {
  res.setTimeout(60 * 60 * 1000); // Set a timeout of 1 hour (adjust as needed)
  next();
});

let timeCapsules = [...initialTimeCapsules];

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

    timeCapsules.push(newCapsule);
    generatedCapsules.push(newCapsule);
  }

  return generatedCapsules;
};

// Socket.io Setup
const io = new Server(5001, { cors: { origin: "*" } });

const getCapsuleStats = () => {
  const stats = { locked: 0, unlocked: 0 };
  timeCapsules.forEach((capsule) => {
    if (capsule.status === "Locked") {
      stats.locked++;
    } else if (capsule.status === "Unlocked") {
      stats.unlocked++;
    }
  });
  return stats;
};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.emit("capsuleStats", getCapsuleStats());

  socket.on("disconnect", () => {
    console.log("Client disconnected");
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
app.get("/capsules", (req, res) => {
  let {
    search = "",
    sort = "asc",
    status = "All",
    offset = 0,
    limit = 9,
  } = req.query;
  offset = parseInt(offset);
  limit = parseInt(limit);

  let result = [...timeCapsules];

  if (search) {
    result = result.filter((capsule) =>
      capsule.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (status === "Locked" || status === "Unlocked") {
    result = result.filter((capsule) => capsule.status === status);
  }

  if (sort === "asc" || sort === "desc") {
    result.sort((a, b) =>
      sort === "asc"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date)
    );
  }

  const paginated = result.slice(offset, offset + limit);

  res.json({
    capsules: paginated,
    hasMore: offset + limit < result.length,
  });
});

// GET a capsule by ID
app.get("/capsule/:id", (req, res) => {
  const capsule = timeCapsules.find((c) => c.id === parseInt(req.params.id));
  if (!capsule) return res.status(404).json({ error: "Capsule not found" });
  res.json(capsule);
});

// POST - Add a new capsule
app.post("/capsules", validateCapsule, (req, res) => {
  const { title, date, status, description } = req.body;
  if (!title || !date || !status || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const newCapsule = {
    id: Math.max(...timeCapsules.map((c) => c.id)) + 1,
    title,
    date,
    status,
    description,
  };

  timeCapsules.push(newCapsule);
  res.status(201).json(newCapsule);
});

// PUT - Update a capsule
app.put("/capsule/:id", (req, res) => {
  const { title, date, status, description } = req.body;
  const capsuleIndex = timeCapsules.findIndex(
    (c) => c.id === parseInt(req.params.id)
  );

  if (capsuleIndex === -1) {
    return res.status(404).json({ error: "Capsule not found" });
  }

  timeCapsules[capsuleIndex] = {
    ...timeCapsules[capsuleIndex],
    title,
    date,
    status,
    description,
  };
  res.json(timeCapsules[capsuleIndex]);
});

// DELETE - Remove a capsule
app.delete("/capsules/:id", (req, res) => {
  const capsuleIndex = timeCapsules.findIndex(
    (c) => c.id === parseInt(req.params.id)
  );
  if (capsuleIndex === -1)
    return res.status(404).json({ error: "Capsule not found" });

  timeCapsules.splice(capsuleIndex, 1);
  res.json({ message: "Capsule deleted successfully" });
});

const uploadDir = path.join("upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const capsuleId = req.params.id;
    const capsuleUploadDir = path.join(uploadDir, capsuleId.toString());

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
app.post("/capsule/:id/upload", upload.array("file", 100), (req, res) => {
  const capsuleId = parseInt(req.params.id);
  const capsule = timeCapsules.find((c) => c.id === capsuleId);
  if (!capsule) {
    return res.status(404).json({ error: "Capsule not found" });
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const fileUrls = req.files.map((file) => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/${capsuleId}/${file.filename}`;
  });

  res.status(201).json({ message: "Files uploaded successfully", fileUrls });
});

app.use("/upload", express.static(uploadDir));

//DOWNLOAD
app.get("/capsule/:id/download", (req, res) => {
  const capsuleId = req.params.id;
  const capsuleUploadDir = path.join(uploadDir, capsuleId.toString());

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
    const filePath = path.join(capsuleUploadDir, file);
    if (fs.statSync(filePath).isFile()) {
      archive.file(filePath, { name: file });
    }
  });
  archive.finalize();
});

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(`Server running on ${process.env.NEXT_PUBLIC_API_BASE_URL}`)
  );
}
