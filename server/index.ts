/// <reference types="bun" />
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "bun";
import dbRoutes from "./routes/db.ts";
import newsRoutes from "./routes/news.ts";

const app = new Hono();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  "*",
  cors({
    origin: [
      "https://banks-buddy.vercel.app",
      "https://banksbuddy.in",
      "http://localhost:5173",
      "http://localhost:3001",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.route("/api", dbRoutes);
app.route("/api/news", newsRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (c) => c.json({ status: "BanksBuddy API running 🚀" }));

// ─── Start ────────────────────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3000;
console.log(`🚀 BanksBuddy server running on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
