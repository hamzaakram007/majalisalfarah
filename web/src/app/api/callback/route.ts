import { NextResponse } from "next/server";
import { z } from "zod";
import { sendWhatsAppNotification } from "@/lib/notifications";
import { createServiceClient } from "@/lib/supabase/server";

const schema = z.object({
  locale: z.enum(["en", "ar"]),
  name: z.string().min(2),
  phone: z.string().min(8),
  preferredTime: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { locale, name, phone, preferredTime, message } = parsed.data;
  const supabase = await createServiceClient();
  if (supabase) {
    await supabase.from("callback_requests").insert({
      name,
      phone,
      preferred_time: preferredTime,
      message,
      locale,
    });
  }

  const adminPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "966570169672";
  await sendWhatsAppNotification({
    to: adminPhone,
    body: `Callback request from ${name} (${phone})${message ? `: ${message}` : ""}`,
  });

  return NextResponse.json({ ok: true });
}
