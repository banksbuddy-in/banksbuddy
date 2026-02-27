export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
    const { amount, customer = {}, serviceTitle, metadata = {} } = body;

    const orderAmount = Number(amount);
    if (!orderAmount || Number.isNaN(orderAmount) || orderAmount <= 0) {
      res.status(400).json({ error: "Invalid amount" });
      return;
    }

    const appId =
      process.env.VITE_CASHFREE_APP_ID || process.env.CASHFREE_APP_ID;
    const secret =
      process.env.VITE_CASHFREE_SECRET_KEY || process.env.CASHFREE_SECRET_KEY;
    const env = (
      process.env.VITE_CASHFREE_API_ENV ||
      process.env.CASHFREE_ENV ||
      "sandbox"
    ).toLowerCase();

    if (!appId || !secret) {
      res
        .status(500)
        .json({ error: "Cashfree keys are not configured properly" });
      return;
    }

    const baseUrl =
      env === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";
    const linkId = `link_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const payload = {
      link_id: linkId,
      link_amount: orderAmount,
      link_currency: "INR",
      link_purpose: metadata.note || `${serviceTitle || "Service"} payment`,
      customer_details: {
        customer_phone: customer.phone || "9999999999",
        customer_email: customer.email || "support@banksbuddy.com",
        customer_name: customer.name || "Guest User",
      },
      link_meta: {
        return_url:
          metadata.returnUrl ||
          "https://banksbuddy.com/payment-status?order_id={order_id}",
      },
      send_email: false,
      send_sms: false,
    };

    const cfRes = await fetch(`${baseUrl}/links`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secret,
      },
      body: JSON.stringify(payload),
    });

    const data = await cfRes.json();

    if (!cfRes.ok) {
      res
        .status(cfRes.status)
        .json({
          error: data?.message || "Cashfree link creation failed",
          details: data,
        });
      return;
    }

    res.status(200).json({
      link_url: data.link_url,
      link_id: data.link_id,
      order_id: linkId,
    });
  } catch (error) {
    console.error("Cashfree link error details:", error);
    res.status(500).json({
      error: "Could not create payment link",
      details: error.message,
    });
  }
}
