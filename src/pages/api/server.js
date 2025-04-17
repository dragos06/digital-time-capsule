import express from "express";
import cors from "cors";
import { dirname, join } from "path";
import fs from "fs";
import http from "http";
import logger from "../../utils/logger.js";
import { fileURLToPath } from "url";
import capsuleRoutes from "../../routes/capsuleRoutes.js";
import generateRoutes from "../../routes/generateRoutes.js";
import fileRoutes from "../../routes/fileRoutes.js";
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
  res.setTimeout(60 * 60 * 1000);
  next();
});

app.get("/", (req, res) => {
  res.redirect("/capsules?limit=99");
});

app.use("/capsules", capsuleRoutes);
app.use("/capsules", generateRoutes);
app.use("/capsules", fileRoutes);
app.use("/upload", express.static(join("upload")));

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () =>
    console.log(`Server running on ${process.env.NEXT_PUBLIC_API_BASE_URL}`)
  );
}

initSocket(server);

export default app;
