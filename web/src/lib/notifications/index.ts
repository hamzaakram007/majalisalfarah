export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderNumber: string;
  totalSar: number;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[email mock]", params);
    return { ok: true, mock: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Majalis Alfarah <orders@majalisalfarah.sa>",
      to: params.to,
      subject: `Order ${params.orderNumber} confirmed`,
      html: `<p>Thank you! Order <strong>${params.orderNumber}</strong> total: ${params.totalSar} SAR.</p>`,
    }),
  });
  return { ok: res.ok, mock: false };
}

export async function sendWhatsAppNotification(params: {
  to: string;
  body: string;
}) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!sid || !token || !from) {
    console.info("[whatsapp mock]", params);
    return { ok: true, mock: true };
  }

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: from,
        To: `whatsapp:${params.to}`,
        Body: params.body,
      }),
    },
  );
  return { ok: res.ok, mock: false };
}
