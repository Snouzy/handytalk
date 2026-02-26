import "dotenv/config";
import express from "express";
import { commentsRouter } from "./routes/comments";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/comments", commentsRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
