export type MoyasarPaymentPayload = {
  amount: number;
  currency: string;
  description: string;
  callback_url: string;
  source: {
    type: string;
  };
  metadata?: Record<string, string>;
};

export async function createMoyasarPayment(
  payload: MoyasarPaymentPayload,
): Promise<{ id: string; url: string } | { error: string }> {
  const secret = process.env.MOYASAR_SECRET_KEY;
  if (!secret || secret.startsWith("sk_test_xxx")) {
    return {
      id: `mock_${Date.now()}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/checkout/mock-success`,
    };
  }

  const res = await fetch("https://api.moyasar.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(secret + ":").toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Payment creation failed" };
  }

  const data = (await res.json()) as {
    id: string;
    source?: { transaction_url?: string };
  };
  return {
    id: data.id,
    url:
      data.source?.transaction_url ??
      `${process.env.NEXT_PUBLIC_APP_URL}/checkout/complete`,
  };
}
