async function testOrder() {
  const payload = {
    customer: {
      name: "Test Buyer Shakil",
      phone: "01700000000",
      email: "test@a1esports.com",
      address: "House 10, Road 2",
      city: "Dhaka",
    },
    items: [
      {
        id: "jer-001",
        title: "A1 Away Kit | Beauty Red – Player Edition",
        price: 850,
        quantity: 1,
        size: "M",
      },
    ],
    total: 0,
    paymentMethod: "Free Coupon (100% OFF)",
    couponCode: "WINNERPMC",
    discountAmount: 850,
  };

  const res = await fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("Order Creation Result:", JSON.stringify(data, null, 2));
}

testOrder().catch(console.error);
