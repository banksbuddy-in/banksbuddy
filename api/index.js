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
    const user = await verifyFirebaseToken(idToken);
    c.set("user", user);
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

// ─── Invoice Data Routes — registered early to avoid route shadowing ────────────
// GET all invoices map { txnId: invoiceData }. Returns {} if node doesn't exist yet.
app.get("/api/revenue/invoices", requireAdmin, async (c) => {
  const data = await dbGet("revenue/invoices").catch(() => null);
  return c.json(data || {});
});
// GET single invoice by txn ID
app.get("/api/revenue/invoices/:id", requireAdmin, async (c) => {
  const data = await dbGet(`revenue/invoices/${c.req.param("id")}`).catch(() => null);
  return c.json(data || null);
});
// POST (upsert) invoice data for a txn ID — auto-creates the RTDB node
app.post("/api/revenue/invoices/:id", requireAdmin, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  await dbSet(`revenue/invoices/${id}`, { ...body, updatedAt: new Date().toISOString() });
  return c.json({ ok: true });
});
// PUT (partial update) invoice data for a txn ID
app.put("/api/revenue/invoices/:id", requireAdmin, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  await dbUpdate(`revenue/invoices/${id}`, { ...body, updatedAt: new Date().toISOString() });
  return c.json({ ok: true });
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
  "instamojo_revenue",
  "cibil_notifications",
  "activity_logs",
];
// Collections where anyone (logged in) can submit a form (public-facing forms)
// Split into two tiers:
// - trulyPublicWrite: no auth needed (public contact/consultation forms)
// - authWriteCollections: requires any authenticated user
const trulyPublicWrite = new Set([
  "consultations",
  "partner_applications",
  "activity_logs",
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
              : col === "instamojo_revenue"
                ? "revenue/instamojo"
                : col === "activity_logs"
                  ? "activity-logs"
                  : col;
  // GET: admin-only for sensitive data, public for display data
  const isSensitive = [
    "users", "cibil_requests", "cibil_notifications",
    "manual_revenue", "instamojo_revenue", "consultations",
    "partner_applications", "activity_logs",
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
    const id = c.req.param("id");
    if (col === "users") {
      try {
        const user = await dbGet(`users/${id}`).catch(() => null);
        await dbDelete(`users/${id}`);
        if (user && user.email) {
          const email = user.email;
          const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
          await dbDelete(`cibil_notifications/${safeEmail}`).catch(() => null);

          const deleteMatching = async (collectionName) => {
            const data = await dbGet(collectionName).catch(() => null);
            if (data) {
              for (const [key, val] of Object.entries(data)) {
                if (val && val.email === email) {
                  await dbDelete(`${collectionName}/${key}`).catch(() => null);
                }
              }
            }
          };

          await Promise.all([
            deleteMatching("cibil_requests"),
            deleteMatching("policyReminders"),
            deleteMatching("partner_applications"),
          ]);
        }
      } catch (err) {
        console.error("Failed to delete user and related data:", err);
        return c.json({ error: "Failed to delete user and related data" }, 500);
      }
    } else if (col === "cibil_requests") {
      try {
        const reqSnap = await dbGet(`cibil_requests/${id}`).catch(() => null);
        if (reqSnap && reqSnap.email) {
          const email = reqSnap.email;
          const users = await dbGet("users").catch(() => null);
          if (users) {
            const userEntry = Object.entries(users).find(([, u]) => u.email === email);
            if (userEntry) {
              await dbUpdate(`users/${userEntry[0]}`, { cibilPaid: null });
            }
          }
        }
      } catch (err) {
        console.error("Error clearing user cibilPaid flag:", err);
      }
      await dbDelete(`${col}/${id}`);
    } else {
      await dbDelete(`${col}/${id}`);
    }
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

// Alias for cibil_requests with underscore (as requested by frontend change)
app.get("/api/cibil_requests", requireAdmin, async (c) => {
  const data = await dbGet("cibil_requests");
  return c.json(data ? Object.keys(data).map(k => ({ id: k, ...data[k] })) : []);
});
app.put("/api/cibil_requests/:id", requireAdmin, async (c) => {
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

// ─── Instamojo Payments ───────────────────────────────────────────────────────
const INSTAMOJO_BASE_URL =
  process.env.INSTAMOJO_BASE_URL || "https://www.instamojo.com/api/1.1";

const instamojoHeaders = () => ({
  "Content-Type": "application/x-www-form-urlencoded",
  "X-Api-Key": process.env.INSTAMOJO_API_KEY || "",
  "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN || "",
});

// POST /api/payment/create-order — creates an Instamojo payment request & returns redirect URL
app.post("/api/payment/create-order", requireAuth, async (c) => {
  const data = await c.req.json();
  const order_id = `cibil_${Date.now()}`;

  // 1. Store pending request in Firebase first to get a request_id
  const requestId = await dbPush("cibil_requests", {
    ...data,
    status: "pending",
    orderId: order_id,
    createdAt: new Date().toISOString(),
  });

  // 2. Build Instamojo redirect URL — includes request_id so we can link payment back
  const redirectUrl = `${process.env.INSTAMOJO_REDIRECT_URL || "https://banksbuddy.in/cibil"}?request_id=${requestId}`;
  const webhookUrl = process.env.INSTAMOJO_WEBHOOK_URL || "";

  // 3. Create Instamojo payment request
  const params = new URLSearchParams({
    purpose: "CIBIL Score Improvement Service",
    amount: String(Number(data.amount).toFixed(2)),
    buyer_name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    redirect_url: redirectUrl,
    send_email: "false",
    send_sms: "false",
    allow_repeated_payments: "false",
  });
  if (webhookUrl) params.set("webhook", webhookUrl);

  let imRes;
  let imData;
  try {
    imRes = await fetch(`${INSTAMOJO_BASE_URL}/payment-requests/`, {
      method: "POST",
      headers: instamojoHeaders(),
      body: params.toString(),
    });
    imData = await imRes.json();
  } catch (err) {
    console.error("Instamojo connection error:", err.message);
    return c.json({ error: "Failed to connect to Instamojo payment gateway" }, 500);
  }

  if (!imData.success) {
    console.error("Instamojo payment request creation failed:", imData);
    return c.json({ error: imData.message || "Failed to create payment request" }, 500);
  }

  // Store Instamojo payment_request_id for later verification
  await dbUpdate(`cibil_requests/${requestId}`, {
    instamojoPaymentRequestId: imData.payment_request.id,
  });

  return c.json({
    payment_url: imData.payment_request.longurl,
    request_id: requestId,
  });
});

// POST /api/payment/verify — verifies Instamojo payment after redirect return
// Receives { payment_id, payment_request_id, payment_status, request_id } from frontend
app.post("/api/payment/verify", requireAuth, async (c) => {
  const { payment_id, payment_request_id, payment_status, request_id } = await c.req.json();

  // Quick guard: Instamojo sets payment_status=Credit on success
  if (payment_status !== "Credit") {
    return c.json({ status: "PAYMENT_NOT_CREDITED" }, 400);
  }

  // Server-side confirmation: fetch the payment request from Instamojo to prevent spoofing
  let verifyData;
  try {
    const verifyRes = await fetch(
      `${INSTAMOJO_BASE_URL}/payment-requests/${payment_request_id}/`,
      { method: "GET", headers: instamojoHeaders() },
    );
    verifyData = await verifyRes.json();
  } catch (err) {
    console.error("Instamojo verify connection error:", err.message);
    return c.json({ status: "VERIFICATION_NETWORK_ERROR" }, 500);
  }

  if (!verifyData.success) {
    console.error("Instamojo verification fetch failed:", verifyData);
    return c.json({ status: "VERIFICATION_FAILED" }, 400);
  }

  // Find the specific payment within the payment request
  const payments = verifyData.payment_request?.payments || [];
  const confirmedPayment = payments.find(
    (p) => p.payment_id === payment_id && p.status === "Credit",
  );

  if (!confirmedPayment) {
    return c.json({ status: "PAYMENT_NOT_CONFIRMED" }, 400);
  }

  // Mark request as paid in Firebase
  await dbUpdate(`cibil_requests/${request_id}`, {
    status: "paid",
    instamojoPaymentId: payment_id,
    instamojoPaymentRequestId: payment_request_id,
    paymentVerifiedAt: new Date().toISOString(),
  });

  const orderSnap = await dbGet(`cibil_requests/${request_id}`);
  if (orderSnap?.email) {
    const users = await dbGet("users");
    const userEntry = Object.entries(users || {}).find(
      ([, u]) => u.email === orderSnap.email,
    );
    if (userEntry)
      await dbUpdate(`users/${userEntry[0]}`, { cibilPaid: true });
  }

  return c.json({ status: "PAID" });
});

// Payment status check — requires auth so users can only check their own payment
app.get("/api/payment/status/:email", requireAuth, async (c) => {
  const email = c.req.param("email");
  const users = await dbGet("users");
  if (Object.values(users || {}).some((u) => u.email === email && u.cibilPaid)) {
    return c.json({ paid: true, completed: true });
  }
  const reqs = await dbGet("cibil_requests");
  const userReqs = Object.values(reqs || {}).filter((r) => r.email === email);
  
  if (userReqs.some((r) => r.status === "verified" || r.status === "paid" || r.status === "completed")) {
    return c.json({ paid: true, completed: true });
  }
  if (userReqs.some((r) => r.status === "initiated" || r.status === "Verification Pending")) {
    return c.json({ paid: true, completed: false });
  }
  return c.json({ paid: false, completed: false });
});

// Custom endpoint to request report and create/update notification
app.post("/api/cibil-notifications/request", requireAuth, async (c) => {
  const user = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const email = user.email || body.email;
  if (!email) return c.json({ error: "Email is required" }, 400);
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");

  // Try to fetch name/phone from the user's DB entry or cibil requests
  let userName = "";
  let userPhone = "";
  try {
    const users = await dbGet("users");
    const userEntry = Object.entries(users || {}).find(([, u]) => u.email === email);
    if (userEntry) {
      const uid = userEntry[0];
      const userDb = await dbGet(`users/${uid}`);
      if (userDb) {
        userName = userDb.fullName || userDb.name || "";
        userPhone = userDb.phone || userDb.mobile || "";
      }
    }
  } catch (e) {}

  if (!userName || !userPhone) {
    try {
      const requests = await dbGet("cibil_requests");
      if (requests) {
        const matched = Object.values(requests).find((r) => r.email === email);
        if (matched) {
          userName = userName || matched.name || matched.fullName || "";
          userPhone = userPhone || matched.phone || matched.mobile || "";
        }
      }
    } catch (e) {}
  }

  const payload = {
    email,
    type: "report_request",
    message: `${email} asked for a CIBIL report.`,
    read: false,
    status: "requested",
    createdAt: new Date().toISOString(),
  };
  if (userName) payload.name = userName;
  if (userPhone) payload.phone = userPhone;

  await dbSet(`cibil_notifications/${safeEmail}`, payload);
  return c.json({ ok: true });
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
