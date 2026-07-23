import { NextResponse } from "next/server";
import { z } from "zod";
import { sendWhatsAppNotification } from "@/lib/notifications";
import { createServiceClient } from "@/lib/supabase/server";

const schema = z.object({
  locale: z.enum(["en", "ar"]),
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  customerEmail: z.string().email().optional(),
  sofaSize: z.string().optional(),
  fabricColor: z.string().optional(),
  foamType: z.string().optional(),
  dimensions: z.string().optional(),
  deliveryCity: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  const supabase = await createServiceClient();
  if (supabase) {
    await supabase.from("quote_requests").insert({
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      customer_email: data.customerEmail,
      locale: data.locale,
      sofa_size: data.sofaSize,
      fabric_color: data.fabricColor,
      foam_type: data.foamType,
      dimensions: data.dimensions,
      delivery_city: data.deliveryCity,
      notes: data.notes,
      status: "new",
    });
  }

  await sendWhatsAppNotification({
    to: data.customerPhone.replace(/\D/g, ""),
    body: `Majalis Alfarah: We received your custom sofa quote request. Our team will contact you soon.`,
  });

  return NextResponse.json({ ok: true });
}
