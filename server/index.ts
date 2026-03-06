import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
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

// ─── Export for Vercel/Bun ────────────────────────────────────────────────────
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);

export default {
  port,
  fetch: app.fetch,
};
