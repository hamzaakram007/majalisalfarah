import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";

const schema = z.object({
  referralCode: z.string().min(4),
  newUserId: z.string().uuid(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = await createServiceClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, mock: true });
  }

  const { data: referrer } = await supabase
    .from("profiles")
    .select("id")
    .eq("referral_code", parsed.data.referralCode)
    .single();

  if (!referrer) {
    return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  }

  await supabase.from("referrals").insert({
    referrer_id: referrer.id,
    referred_id: parsed.data.newUserId,
    reward_points: 50,
  });

  await supabase
    .from("profiles")
    .update({ referred_by: referrer.id })
    .eq("id", parsed.data.newUserId);

  return NextResponse.json({ ok: true, rewardPoints: 50 });
}
