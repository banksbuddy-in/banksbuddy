import { Hono, Context } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import dbRoutes from "./routes/db";
import newsRoutes from "./routes/news";

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
app.get("/", (c: Context) => c.json({ status: "BanksBuddy API running 🚀" }));

// ─── Start ────────────────────────────────────────────────────────────────────
// ─── Export for Vercel ────────────────────────────────────────────────────────
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

// ─── Start for Local Bun ──────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3000;

if (typeof (globalThis as any).Bun !== "undefined") {
  console.log(`🚀 BanksBuddy local server running on http://localhost:${port}`);
  (globalThis as any).Bun.serve({
    port,
    fetch: app.fetch,
  });
}

export default handle(app);
