import { NextResponse } from "next/server";
import { loyaltySettings } from "@/lib/data/mock";
import { pointsFromPurchase } from "@/lib/loyalty/calculate";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("order");
  if (!orderNumber) {
    return NextResponse.redirect(
      new URL("/en/orders?error=missing_order", request.url),
    );
  }

  const supabase = await createServiceClient();
  if (supabase) {
    const { data: order } = await supabase
      .from("orders")
      .select("id, total_sar, user_id, status")
      .eq("order_number", orderNumber)
      .single();

    if (order) {
      await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", order.id);
      await supabase
        .from("payments")
        .update({ status: "paid" })
        .eq("order_id", order.id);

      if (order.user_id) {
        const pts = pointsFromPurchase(
          Number(order.total_sar),
          loyaltySettings,
        );
        await supabase.from("loyalty_transactions").insert({
          user_id: order.user_id,
          order_id: order.id,
          points: pts,
          reason: "purchase",
        });
        const { data: profile } = await supabase
          .from("profiles")
          .select("loyalty_points")
          .eq("id", order.user_id)
          .single();
        if (profile) {
          await supabase
            .from("profiles")
            .update({ loyalty_points: (profile.loyalty_points ?? 0) + pts })
            .eq("id", order.user_id);
        }
      }
    }
  }

  return NextResponse.redirect(
    new URL(`/en/orders/${orderNumber}?success=1`, request.url),
  );
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const orderNumber =
    payload?.metadata?.orderNumber ?? payload?.description?.match(/MAF-[\w-]+/)?.[0];
  if (orderNumber) {
    const url = new URL(request.url);
    url.searchParams.set("order", orderNumber);
    return GET(new Request(url.toString(), request));
  }
  return NextResponse.json({ received: true });
}
