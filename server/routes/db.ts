import { Hono } from "hono";
import { dbGet, dbPush, dbUpdate, dbDelete, dbSet } from "../firebase-admin.ts";

const router = new Hono();

// ─── Helpers ────────────────────────────────────────────────────────────────
const toArray = (data: unknown) => {
  if (!data || typeof data !== "object") return [];
  return Object.entries(data as Record<string, unknown>).map(([id, val]) => ({
    id,
    ...(val as object),
  }));
};

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
router.get("/stats", async (c: any) => {
  try {
    const [
      consultations, policies, team, offers, reviews,
      careers, partners, cibil, revenue,
    ] = await Promise.all([
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

    const count = (d: unknown) =>
      d && typeof d === "object" ? Object.keys(d as object).length : 0;

    return c.json({
      consultations: count(consultations),
      policies: count(policies),
      team: count(team),
      offers: count(offers),
      reviews: count(reviews),
      careers: count(careers),
      partners: count(partners),
      cibil: count(cibil),
      revenue: count(revenue),
    });
  } catch (e: any) {
    return c.json({ error: "Failed to fetch stats", detail: e?.message }, 500);
  }
});

// ─── Consultations ────────────────────────────────────────────────────────────
router.get("/consultations", async (c: any) => {
  const data = await dbGet("consultations");
  return c.json(toArray(data));
});

router.post("/consultations", async (c: any) => {
  const body = await c.req.json();
  const id = await dbPush("consultations", { ...body, createdAt: new Date().toISOString() });
  return c.json({ id }, 201);
});

// ─── Offers ───────────────────────────────────────────────────────────────────
router.get("/offers", async (c: any) => {
  const data = await dbGet("offers");
  return c.json(toArray(data));
});

router.post("/offers", async (c: any) => {
  const body = await c.req.json();
  const id = Date.now().toString();
  await dbSet(`offers/${id}`, { ...body, createdAt: new Date().toISOString() });
  return c.json({ id }, 201);
});

router.delete("/offers/:id", async (c: any) => {
  await dbDelete(`offers/${c.req.param("id")}`);
  return c.json({ ok: true });
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
router.get("/reviews", async (c: any) => {
  const data = await dbGet("reviews");
  return c.json(toArray(data));
});

router.post("/reviews", async (c: any) => {
  const body = await c.req.json();
  const id = await dbPush("reviews", { ...body, createdAt: new Date().toISOString() });
  return c.json({ id }, 201);
});

router.put("/reviews/:id", async (c: any) => {
  const body = await c.req.json();
  await dbUpdate(`reviews/${c.req.param("id")}`, { ...body, updatedAt: new Date().toISOString() });
  return c.json({ ok: true });
});

router.delete("/reviews/:id", async (c: any) => {
  await dbDelete(`reviews/${c.req.param("id")}`);
  return c.json({ ok: true });
});

// ─── Team ─────────────────────────────────────────────────────────────────────
router.get("/team", async (c: any) => {
  const data = await dbGet("team");
  return c.json(toArray(data));
});

router.post("/team/:id", async (c: any) => {
  const body = await c.req.json();
  const id = c.req.param("id");
  await dbSet(`team/${id}`, body);
  return c.json({ id }, 201);
});

router.delete("/team/:id", async (c: any) => {
  await dbDelete(`team/${c.req.param("id")}`);
  return c.json({ ok: true });
});

// ─── Careers ──────────────────────────────────────────────────────────────────
router.get("/careers", async (c: any) => {
  const data = await dbGet("careers");
  return c.json(toArray(data));
});

router.post("/careers", async (c: any) => {
  const body = await c.req.json();
  const id = await dbPush("careers", { ...body, createdAt: new Date().toISOString() });
  return c.json({ id }, 201);
});

// ─── Policy Reminders ─────────────────────────────────────────────────────────
router.get("/policies", async (c: any) => {
  const data = await dbGet("policyReminders");
  return c.json(toArray(data));
});

router.post("/policies", async (c: any) => {
  const body = await c.req.json();
  const id = Date.now().toString();
  await dbSet(`policyReminders/${id}`, { ...body, createdAt: new Date().toISOString() });
  return c.json({ id }, 201);
});

router.put("/policies/:id", async (c: any) => {
  const body = await c.req.json();
  await dbUpdate(`policyReminders/${c.req.param("id")}`, { ...body, updatedAt: new Date().toISOString() });
  return c.json({ ok: true });
});

router.delete("/policies/:id", async (c: any) => {
  await dbDelete(`policyReminders/${c.req.param("id")}`);
  return c.json({ ok: true });
});

// ─── Partner Applications ─────────────────────────────────────────────────────
router.get("/partners", async (c: any) => {
  const data = await dbGet("partner_applications");
  return c.json(data ?? {});
});

router.post("/partners", async (c: any) => {
  const body = await c.req.json();
  const id = await dbPush("partner_applications", {
    ...body, status: "pending", submittedAt: new Date().toISOString(),
  });
  return c.json({ id }, 201);
});

router.put("/partners/:id", async (c: any) => {
  const body = await c.req.json();
  await dbUpdate(`partner_applications/${c.req.param("id")}`, body);
  return c.json({ ok: true });
});

router.delete("/partners/:id", async (c: any) => {
  await dbDelete(`partner_applications/${c.req.param("id")}`);
  return c.json({ ok: true });
});

// ─── CIBIL Requests ───────────────────────────────────────────────────────────
router.get("/cibil-requests", async (c: any) => {
  const data = await dbGet("cibil_requests");
  return c.json(data ?? {});
});

router.put("/cibil-requests/:id", async (c: any) => {
  const body = await c.req.json();
  await dbUpdate(`cibil_requests/${c.req.param("id")}`, body);
  return c.json({ ok: true });
});

// ─── Users / Admin Management ─────────────────────────────────────────────────
router.get("/users", async (c: any) => {
  const data = await dbGet("users");
  return c.json(toArray(data));
});

router.put("/users/:id", async (c: any) => {
  const body = await c.req.json();
  await dbUpdate(`users/${c.req.param("id")}`, body);
  return c.json({ ok: true });
});

// ─── Revenue ──────────────────────────────────────────────────────────────────
router.get("/revenue/cibil", async (c: any) => {
  const data = await dbGet("cibil_requests");
  return c.json(data ?? {});
});

router.get("/revenue/manual", async (c: any) => {
  const data = await dbGet("manual_revenue");
  return c.json(data ?? {});
});

router.post("/revenue/manual", async (c: any) => {
  const body = await c.req.json();
  const id = await dbPush("manual_revenue", body);
  return c.json({ id }, 201);
});

router.put("/revenue/manual/:id", async (c: any) => {
  const body = await c.req.json();
  await dbUpdate(`manual_revenue/${c.req.param("id")}`, body);
  return c.json({ ok: true });
});

router.get("/revenue/cashfree", async (c: any) => {
  const data = await dbGet("cashfree_revenue");
  return c.json(data ?? {});
});

router.put("/revenue/cashfree/:id", async (c: any) => {
  const body = await c.req.json();
  await dbUpdate(`cashfree_revenue/${c.req.param("id")}`, body);
  return c.json({ ok: true });
});

router.put("/revenue/cibil/:id", async (c: any) => {
  const body = await c.req.json();
  await dbUpdate(`cibil_requests/${c.req.param("id")}`, body);
  return c.json({ ok: true });
});

// ─── Cashfree Payments Integration ────────────────────────────────────────────
router.post("/payment/create-order", async (c: any) => {
  try {
    const { name, email, phone, amount, pan, address, state, city, accountNumber, salaryStatus } = await c.req.json();
    const order_id = `cibil_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 1. Create pending record in Firebase
    const requestId = await dbPush("cibil_requests", {
      name,
      email,
      phone,
      pan: pan || "",
      address: address || "",
      state: state || "",
      city: city || "",
      accountNumber: accountNumber || "",
      salaryStatus: salaryStatus || "",
      amount,
      status: "pending",
      orderId: order_id,
      createdAt: new Date().toISOString(),
    });

    // 2. Call Cashfree to create the order
    const isProd = process.env.VITE_CASHFREE_API_ENV === "production";
    const baseUrl = isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
    
    const response = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.VITE_CASHFREE_APP_ID || "",
        "x-client-secret": process.env.VITE_CASHFREE_SECRET_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_amount: amount,
        order_currency: "INR",
        order_id: order_id,
        customer_details: {
          customer_id: phone || `cust_${Date.now()}`,
          customer_phone: phone || "9999999999",
          customer_name: name || "Customer",
          customer_email: email || "customer@example.com",
        },
        order_meta: {
          // Cashfree checkout popup configuration
          payment_methods: "cc,dc,ccc,emi,nb,upi,paypal,app",
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Cashfree Order Error:", errText);
      throw new Error(`Cashfree error: ${errText}`);
    }

    const orderData = await response.json() as any;
    
    return c.json({
      payment_session_id: orderData.payment_session_id,
      order_id: order_id,
      request_id: requestId,
    });
  } catch (err: any) {
    return c.json({ error: "Failed to create order", detail: err.message }, 500);
  }
});

router.post("/payment/verify", async (c: any) => {
  try {
    const { order_id, request_id } = await c.req.json();

    const isProd = process.env.VITE_CASHFREE_API_ENV === "production";
    const baseUrl = isProd
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";

    const response = await fetch(`${baseUrl}/orders/${order_id}`, {
      method: "GET",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.VITE_CASHFREE_APP_ID || "",
        "x-client-secret": process.env.VITE_CASHFREE_SECRET_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to verify order with Cashfree");
    }

    const orderData = (await response.json()) as any;

    if (orderData.order_status === "PAID") {
      // 1. Update order record
      await dbUpdate(`cibil_requests/${request_id}`, {
        status: "paid",
        paymentVerifiedAt: new Date().toISOString(),
      });

      // 2. Effort to tag user profile if possible
      try {
        const orderSnapshot = (await dbGet(`cibil_requests/${request_id}`)) as any;
        const email = orderSnapshot?.email;
        if (email) {
          const users = await dbGet("users");
          if (users) {
            const userEntry = Object.entries(users).find(
              ([uid, u]: [string, any]) => u.email === email,
            );
            if (userEntry) {
              await dbUpdate(`users/${userEntry[0]}`, { cibilPaid: true });
            }
          }
        }
      } catch (profileErr) {
        console.error("Non-critical: Failed to tag user profile:", profileErr);
      }

      return c.json({ status: "PAID", message: "Payment successful" });
    } else {
      return c.json({
        status: orderData.order_status,
        message: "Payment not completed",
      });
    }
  } catch (err: any) {
    return c.json(
      { error: "Failed to verify order", detail: err.message },
      500,
    );
  }
});

router.get("/payment/status/:email", async (c: any) => {
  try {
    const email = c.req.param("email");
    if (!email) return c.json({ error: "Email required" }, 400);

    // Check user profile first (fastest)
    const users = await dbGet("users");
    if (users) {
      const user = Object.values(users).find((u: any) => u.email === email) as any;
      if (user?.cibilPaid) {
        return c.json({ paid: true, source: "profile" });
      }
    }

    // Fallback: Check cibil_requests (most accurate for guest/new flows)
    const requests = await dbGet("cibil_requests");
    if (requests) {
      const paidReq = Object.values(requests).find(
        (r: any) => r.email === email && r.status === "paid",
      );
      if (paidReq) return c.json({ paid: true, source: "history" });
    }

    return c.json({ paid: false });
  } catch (err: any) {
    return c.json({ error: "Status check failed", detail: err.message }, 500);
  }
});

export default router;
