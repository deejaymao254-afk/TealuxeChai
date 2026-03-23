import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";

// __dirname replacement for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

// Define log file path (Notepad-friendly .txt)
const logFile = path.join(__dirname, "duka2_logs.txt");

// Ensure log file exists
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "", "utf-8");
}

// Helper to format log entries
function formatLogEntry(level, message, data) {
  const timestamp = new Date().toISOString();
  const dataStr = data ? JSON.stringify(data, null, 2) : "";
  return `[${timestamp}] [${level}] ${message} ${dataStr}\n`;
}

// POST /log — append to duka2_logs.txt
app.post("/log", (req, res) => {
  const { level = "INFO", message = "", data } = req.body;
  const entry = formatLogEntry(level, message, data);

  fs.appendFile(logFile, entry, (err) => {
    if (err) {
      console.error("Failed to write log:", err);
      return res.status(500).json({ status: "error", error: err.message });
    }

    // Output to console as well
    console.log(entry.trim());
    res.json({ status: "ok" });
  });
});

// GET /logs — optional endpoint to read logs in-browser/dev
app.get("/logs", (req, res) => {
  fs.readFile(logFile, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Failed to read logs");
    }
    res.type("text/plain").send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Logger server running on http://localhost:${PORT}`);
  console.log(`Logs are being saved to: ${logFile}`);
});