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

// ─── Auth Helpers ─────────────────────────────────────────────────────────────
const ADMIN_UID = "YNzKifqerZSPHAFVqfpUFxbwcRB2";
const FIREBASE_PROJECT_ID = "banksbuddy-fbcc4";

/**
 * Verifies a Firebase ID token using the public key endpoint.
 * Returns the decoded payload or throws.
 */
const verifyFirebaseToken = async (idToken) => {
  const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );
  if (!res.ok) throw new Error("Token verification request failed");
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const user = data.users?.[0];
  if (!user) throw new Error("No user found for token");
  return user;
};

/**
 * Hono middleware — requires a valid Firebase ID token with admin UID.
 * Pass `publicWrite: true` to allow any authenticated user to write
 * (used for public form submissions like consultations, partner apps, etc.)
 */
const requireAdmin = async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!idToken) {
    return c.json({ error: "Unauthorized — no token" }, 401);
  }
  try {
    const user = await verifyFirebaseToken(idToken);
    if (user.localId !== ADMIN_UID) {
      return c.json({ error: "Forbidden — admin only" }, 403);
    }
    await next();
  } catch (err) {
    return c.json({ error: "Unauthorized — invalid token" }, 401);
  }
};

/**
 * Hono middleware — requires any valid authenticated Firebase user.
 * Used for public form submissions that should require login.
 */
const requireAuth = async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!idToken) {
    return c.json({ error: "Unauthorized — please log in" }, 401);
  }
  try {
    await verifyFirebaseToken(idToken);
    await next();
  } catch (err) {
    return c.json({ error: "Unauthorized — invalid token" }, 401);
  }
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

// Stats — requires admin (reads all sensitive collections)
app.get("/api/stats", requireAdmin, async (c) => {
  const [cs, pl, tm, of, rv, cr, pr, cb, rn] = await Promise.all([
    dbGet("consultations").catch(() => null),
    dbGet("policyReminders").catch(() => null),
    dbGet("team").catch(() => null),
    dbGet("offers").catch(() => null),
    dbGet("reviews").catch(() => null),
    dbGet("careers").catch(() => null),
    dbGet("partner_applications").catch(() => null),
    dbGet("cibil_requests").catch(() => null),
    dbGet("manual_revenue").catch(() => null),
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
// Collections where anyone (logged in) can submit a form (public-facing forms)
// Split into two tiers:
// - trulyPublicWrite: no auth needed (public contact/consultation forms)
// - authWriteCollections: requires any authenticated user
const trulyPublicWrite = new Set([
  "consultations",
  "partner_applications",
]);
const authWriteCollections = new Set([
  "policyReminders",
  "cibil_requests",
]);

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
  // GET: admin-only for sensitive data, public for display data
  const isSensitive = [
    "users", "cibil_requests", "cibil_notifications",
    "manual_revenue", "cashfree_revenue", "consultations",
    "partner_applications",
  ].includes(col);
  if (isSensitive) {
    app.get(`/api/${path}`, requireAdmin, async (c) => {
      const data = await dbGet(col);
      if (!data) return c.json([]);
      return c.json(toArray(data));
    });
  } else {
    app.get(`/api/${path}`, async (c) => {
      const data = await dbGet(col);
      if (!data) return c.json([]);
      return c.json(toArray(data));
    });
  }
  // POST: explicit if/else for each auth tier
  if (trulyPublicWrite.has(col)) {
    // No auth needed — public contact/consultation forms
    app.post(`/api/${path}`, async (c) => {
      const body = await c.req.json();
      return c.json(
        { id: await dbPush(col, { ...body, createdAt: new Date().toISOString() }) },
        201,
      );
    });
  } else if (authWriteCollections.has(col)) {
    // Any authenticated user can submit
    app.post(`/api/${path}`, requireAuth, async (c) => {
      const body = await c.req.json();
      return c.json(
        { id: await dbPush(col, { ...body, createdAt: new Date().toISOString() }) },
        201,
      );
    });
  } else {
    // Admin only
    app.post(`/api/${path}`, requireAdmin, async (c) => {
      const body = await c.req.json();
      return c.json(
        { id: await dbPush(col, { ...body, createdAt: new Date().toISOString() }) },
        201,
      );
    });
  }
  // PUT and DELETE: always admin only
  app.put(`/api/${path}/:id`, requireAdmin, async (c) => {
    await dbUpdate(`${col}/${c.req.param("id")}`, await c.req.json());
    return c.json({ ok: true });
  });
  app.delete(`/api/${path}/:id`, requireAdmin, async (c) => {
    await dbDelete(`${col}/${c.req.param("id")}`);
    return c.json({ ok: true });
  });
});

// Revenue Special Routes (compat — read is admin-only)
app.get("/api/revenue/cibil", requireAdmin, async (c) =>
  c.json((await dbGet("cibil_requests")) || {}),
);
app.put("/api/revenue/cibil/:id", requireAdmin, async (c) => {
  await dbUpdate(`cibil_requests/${c.req.param("id")}`, await c.req.json());
  return c.json({ ok: true });
});

// News
app.get("/api/news", async (c) => {
  try {
    const API_KEY = process.env.GNEWS_API_KEY;
    if (!API_KEY) return c.json({ articles: [] });
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=finance+banking&country=in&lang=en&max=4&apikey=${API_KEY}`,
    );
    if (!res.ok) return c.json({ articles: [] });
    return c.json(await res.json());
  } catch {
    return c.json({ articles: [] });
  }
});

// Payments — create-order requires an authenticated user (any logged-in user)
app.post("/api/payment/create-order", requireAuth, async (c) => {
  const data = await c.req.json();
  const order_id = `cibil_${Date.now()}`;
  const requestId = await dbPush("cibil_requests", {
    ...data,
    status: "pending",
    orderId: order_id,
    createdAt: new Date().toISOString(),
  });

  const isProd = process.env.CASHFREE_API_ENV === "production";
  const cfRes = await fetch(
    `${isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg"}/orders`,
    {
      method: "POST",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID || "",
        "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
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

app.post("/api/payment/verify", requireAuth, async (c) => {
  const { order_id, request_id } = await c.req.json();
  const isProd = process.env.CASHFREE_API_ENV === "production";
  const res = await fetch(
    `${isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg"}/orders/${order_id}`,
    {
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
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

// Payment status check — requires auth so users can only check their own payment
app.get("/api/payment/status/:email", requireAuth, async (c) => {
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

// ─── Global error handler (prevents Bun from crashing on unhandled route errors)
app.onError((err, c) => {
  console.error("[API Error]", err.message);
  return c.json({ error: "Internal server error" }, 500);
});

// ─── Export ───────────────────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3000;
if (typeof Bun !== "undefined") {
  console.log(`🚀 Local API: http://localhost:${port}/api`);
  Bun.serve({
    port,
    fetch: async (req) => {
      try {
        return await app.fetch(req);
      } catch (err) {
        console.error("[Bun Unhandled]", err);
        return new Response(JSON.stringify({ error: "Server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    },
  });
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
