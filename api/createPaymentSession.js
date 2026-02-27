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

    // Extract the specific fields from the request
    const {
      name,
      phone,
      email,
      city,
      state,
      income,
      amount,
      date,
      serviceTitle,
    } = body;

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

    // Generate a unique order ID
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const payload = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: "INR",
      order_note: `${serviceTitle || "Service"} payment`,
      customer_details: {
        customer_id: phone || `guest_${Date.now()}`,
        customer_phone: phone || "9999999999",
        customer_email: email || "support@banksbuddy.com",
        customer_name: name || "Guest User",
      },
      order_meta: {
        return_url: `https://banksbuddy.com/payment-status?order_id={order_id}`,
      },
      order_tags: {
        city: city || "Unknown",
        state: state || "Unknown",
        income: income || "Unknown",
        service: serviceTitle || "Not Specified",
        date: date || new Date().toISOString(),
      },
    };

    const cfRes = await fetch(`${baseUrl}/orders`, {
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
      res.status(cfRes.status).json({
        error: data?.message || "Cashfree order creation failed",
        details: data,
      });
      return;
    }

    // Return the payment_session_id required for the JS SDK Drop-in checkout
    res.status(200).json({
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
      cf_order_id: data.cf_order_id,
    });
  } catch (error) {
    console.error("Cashfree order error details:", error);
    res.status(500).json({
      error: "Could not create payment session",
      details: error.message,
    });
  }
}
