import { handle } from "hono/vercel";
import { Hono } from "hono";
import dbRoutes from "../server/routes/db";
import newsRoutes from "../server/routes/news";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: [
      "https://banks-buddy.vercel.app",
      "https://banksbuddy.in",
      "http://localhost:5173",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.route("/api", dbRoutes);
app.route("/api/news", newsRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

export default handle(app);
