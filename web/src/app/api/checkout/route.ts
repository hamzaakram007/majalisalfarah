import { NextResponse } from "next/server";
import { z } from "zod";
import { loyaltySettings } from "@/lib/data/mock";
import { pointsFromPurchase } from "@/lib/loyalty/calculate";
import { createMoyasarPayment } from "@/lib/payments/moyasar";
import { sendOrderConfirmationEmail, sendWhatsAppNotification } from "@/lib/notifications";
import { validateAndPriceCartItems } from "@/lib/commerce/validate-cart";
import { createServiceClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/utils";

const schema = z.object({
  locale: z.enum(["en", "ar"]),
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().min(8),
    email: z.string().email().optional(),
    city: z.string().min(2),
    address: z.string().min(5),
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().nullable().optional(),
        options: z.record(z.string(), z.string()).optional(),
        lineKey: z.string().optional(),
        name: z.string(),
        quantity: z.number().int().positive(),
        unitPriceSar: z.number().positive(),
      }),
    )
    .min(1),
  redeemLoyalty: z.boolean().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { locale, customer, items: rawItems } = parsed.data;

  const validated = await validateAndPriceCartItems(locale, rawItems);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }
  const items = validated.items;

  const subtotal = items.reduce(
    (s, i) => s + i.unitPriceSar * i.quantity,
    0,
  );
  const shipping = subtotal >= 5000 ? 0 : 99;
  const total = subtotal + shipping;
  const orderNumber = generateOrderNumber();
  const pointsEarned = pointsFromPurchase(total, loyaltySettings);

  const supabase = await createServiceClient();
  let orderId = `local-${orderNumber}`;

  if (supabase) {
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email,
        shipping_city: customer.city,
        shipping_address: customer.address,
        locale,
        status: "pending",
        subtotal_sar: subtotal,
        shipping_sar: shipping,
        total_sar: total,
        loyalty_points_earned: pointsEarned,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    orderId = order.id;

    await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: orderId,
        product_id: i.productId,
        variant_id: i.variantId ?? null,
        options_json: i.options ?? {},
        line_key: i.lineKey,
        product_name: i.name,
        quantity: i.quantity,
        unit_price_sar: i.unitPriceSar,
        line_total_sar: i.unitPriceSar * i.quantity,
      })),
    );

    await supabase.from("payments").insert({
      order_id: orderId,
      amount_sar: total,
      status: "pending",
      provider: "moyasar",
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const payment = await createMoyasarPayment({
    amount: Math.round(total * 100),
    currency: "SAR",
    description: `Order ${orderNumber}`,
    callback_url: `${appUrl}/api/webhooks/moyasar?order=${orderNumber}`,
    source: { type: "creditcard" },
    metadata: { orderNumber, orderId },
  });

  if ("error" in payment) {
    return NextResponse.json({ error: payment.error }, { status: 502 });
  }

  if (supabase) {
    await supabase
      .from("payments")
      .update({
        provider_payment_id: payment.id,
        metadata: { paymentUrl: payment.url },
      })
      .eq("order_id", orderId);
  }

  if (customer.email) {
    await sendOrderConfirmationEmail({
      to: customer.email,
      orderNumber,
      totalSar: total,
    });
  }

  await sendWhatsAppNotification({
    to: customer.phone.replace(/\D/g, ""),
    body: `Majalis Alfarah: Order ${orderNumber} received. Total ${total} SAR.`,
  });

  return NextResponse.json({
    orderNumber,
    orderId,
    paymentUrl: payment.url,
    total,
  });
}
