import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";

const app = new Hono();

// ─── Firebase Helper Logic (Inlined) ──────────────────────────────────────────
const DB_URL =
  process.env.FIREBASE_DATABASE_URL ||
  "https://banksbuddy-fbcc4-default-rtdb.firebaseio.com";
const DB_SECRET = process.env.FIREBASE_DATABASE_SECRET;

const authParam = () => (DB_SECRET ? `?auth=${DB_SECRET}` : "");

const dbGet = async (path) => {
  const res = await fetch(`${DB_URL}/${path}.json${authParam()}`);
  if (!res.ok) throw new Error(`Firebase GET ${path} failed`);
  return res.json();
};

const dbPush = async (path, data) => {
  const res = await fetch(`${DB_URL}/${path}.json${authParam()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.name;
};

const dbSet = async (path, data) => {
  await fetch(`${DB_URL}/${path}.json${authParam()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

const dbUpdate = async (path, data) => {
  await fetch(`${DB_URL}/${path}.json${authParam()}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

const dbDelete = async (path) => {
  await fetch(`${DB_URL}/${path}.json${authParam()}`, { method: "DELETE" });
};

const toArray = (data) => {
  if (!data || typeof data !== "object") return [];
  return Object.entries(data).map(([id, val]) => ({ id, ...val }));
};

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  "*",
  cors({
    origin: [
      "https://banksbuddy.vercel.app",
      "https://banks-buddy.vercel.app",
      "https://banksbuddy.in",
      "http://localhost:5173",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health
app.get("/api", (c) => c.json({ status: "BanksBuddy Unified API running 🚀" }));

// Stats
app.get("/api/stats", async (c) => {
  const [cs, pl, tm, of, rv, cr, pr, cb, rn] = await Promise.all([
    dbGet("consultations"),
    dbGet("policyReminders"),
    dbGet("team"),
    dbGet("offers"),
    dbGet("reviews"),
    dbGet("careers"),
    dbGet("partner_applications"),
    dbGet("cibil_requests"),
    dbGet("manual_revenue"),
  ]);
  const cnt = (d) => (d ? Object.keys(d).length : 0);
  return c.json({
    consultations: cnt(cs),
    policies: cnt(pl),
    team: cnt(tm),
    offers: cnt(of),
    reviews: cnt(rv),
    careers: cnt(cr),
    partners: cnt(pr),
    cibil: cnt(cb),
    revenue: cnt(rn),
  });
});

// Database CRUD (Consultations, Offers, Reviews, Team, Careers, Policies, Partners, Users)
const collections = [
  "consultations",
  "offers",
  "reviews",
  "team",
  "careers",
  "policyReminders",
  "partner_applications",
  "users",
  "cibil_requests",
  "manual_revenue",
  "cashfree_revenue",
  "cibil_notifications",
];
collections.forEach((col) => {
  const path =
    col === "policyReminders"
      ? "policies"
      : col === "partner_applications"
        ? "partners"
        : col === "cibil_requests"
          ? "cibil-requests"
          : col === "cibil_notifications"
            ? "cibil-notifications"
            : col === "manual_revenue"
              ? "revenue/manual"
              : col === "cashfree_revenue"
                ? "revenue/cashfree"
                : col;
  app.get(`/api/${path}`, async (c) => {
    const data = await dbGet(col);
    if (!data) return c.json([]);
    return c.json(toArray(data));
  });
  app.post(`/api/${path}`, async (c) => {
    const body = await c.req.json();
    return c.json(
      {
        id: await dbPush(col, { ...body, createdAt: new Date().toISOString() }),
      },
      201,
    );
  });
  app.put(`/api/${path}/:id`, async (c) => {
    await dbUpdate(`${col}/${c.req.param("id")}`, await c.req.json());
    return c.json({ ok: true });
  });
  app.delete(`/api/${path}/:id`, async (c) => {
    await dbDelete(`${col}/${c.req.param("id")}`);
    return c.json({ ok: true });
  });
});

// Revenue Special Routes (GETs are now handled by loop above, keeping some for compatibility if needed)
app.get("/api/revenue/cibil", async (c) =>
  c.json((await dbGet("cibil_requests")) || {}),
);
app.put("/api/revenue/cibil/:id", async (c) => {
  await dbUpdate(`cibil_requests/${c.req.param("id")}`, await c.req.json());
  return c.json({ ok: true });
});

// News
app.get("/api/news", async (c) => {
  const API_KEY = process.env.GNEWS_API_KEY || process.env.VITE_GNEWS_API_KEY;
  const res = await fetch(
    `https://gnews.io/api/v4/search?q=finance+banking&country=in&lang=en&max=4&apikey=${API_KEY}`,
  );
  return c.json(await res.json());
});

// Payments
app.post("/api/payment/create-order", async (c) => {
  const data = await c.req.json();
  const order_id = `cibil_${Date.now()}`;
  const requestId = await dbPush("cibil_requests", {
    ...data,
    status: "pending",
    orderId: order_id,
    createdAt: new Date().toISOString(),
  });

  const isProd = process.env.VITE_CASHFREE_API_ENV === "production";
  const cfRes = await fetch(
    `${isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg"}/orders`,
    {
      method: "POST",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.VITE_CASHFREE_APP_ID || "",
        "x-client-secret": process.env.VITE_CASHFREE_SECRET_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_amount: data.amount,
        order_currency: "INR",
        order_id,
        customer_details: {
          customer_id: data.phone || "cust",
          customer_phone: data.phone,
          customer_email: data.email,
        },
      }),
    },
  );
  const cfData = await cfRes.json();
  return c.json({
    payment_session_id: cfData.payment_session_id,
    order_id,
    request_id: requestId,
  });
});

app.post("/api/payment/verify", async (c) => {
  const { order_id, request_id } = await c.req.json();
  const isProd = process.env.VITE_CASHFREE_API_ENV === "production";
  const res = await fetch(
    `${isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg"}/orders/${order_id}`,
    {
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.VITE_CASHFREE_APP_ID,
        "x-client-secret": process.env.VITE_CASHFREE_SECRET_KEY,
      },
    },
  );
  const order = await res.json();
  if (order.order_status === "PAID") {
    await dbUpdate(`cibil_requests/${request_id}`, {
      status: "paid",
      paymentVerifiedAt: new Date().toISOString(),
    });
    const orderSnap = await dbGet(`cibil_requests/${request_id}`);
    if (orderSnap?.email) {
      const users = await dbGet("users");
      const userEntry = Object.entries(users || {}).find(
        ([uid, u]) => u.email === orderSnap.email,
      );
      if (userEntry)
        await dbUpdate(`users/${userEntry[0]}`, { cibilPaid: true });
    }
    return c.json({ status: "PAID" });
  }
  return c.json({ status: order.order_status });
});

app.get("/api/payment/status/:email", async (c) => {
  const email = c.req.param("email");
  const users = await dbGet("users");
  if (Object.values(users || {}).some((u) => u.email === email && u.cibilPaid))
    return c.json({ paid: true });
  const reqs = await dbGet("cibil_requests");
  if (
    Object.values(reqs || {}).some(
      (r) => r.email === email && r.status === "paid",
    )
  )
    return c.json({ paid: true });
  return c.json({ paid: false });
});

// ─── Export ───────────────────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3000;
if (typeof Bun !== "undefined") {
  console.log(`🚀 Local API: http://localhost:${port}/api`);
  Bun.serve({ port, fetch: app.fetch });
}

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

// Use Edge runtime for better performance and Web Standard Request/Response compatibility
export const config = {
  runtime: "edge",
};

export default handle(app);
