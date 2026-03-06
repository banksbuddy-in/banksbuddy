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

export default router;
