import { Hono } from "hono";

const router = new Hono();

router.get("/", async (c) => {
  const API_KEY = process.env.GNEWS_API_KEY;
  if (!API_KEY) return c.json({ error: "API key not configured" }, 500);

  try {
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=finance%20OR%20banking%20OR%20investment%20OR%20stock%20market&country=in&lang=en&max=4&apikey=${API_KEY}`
    );
    if (!res.ok) throw new Error(`GNews API error: ${res.status}`);
    const data = await res.json();
    return c.json(data);
  } catch (e) {
    return c.json({ error: "Failed to fetch news" }, 500);
  }
});

export default router;
