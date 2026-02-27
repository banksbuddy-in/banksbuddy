const test = async () => {
  try {
    const res = await fetch("http://localhost:5174/api/createPaymentSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        phone: "9999999999",
        email: "test@example.com",
        city: "Test City",
        paymentId: "PAY-123",
        amount: 100,
        date: "2023-11-20",
      }),
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
};
test();
