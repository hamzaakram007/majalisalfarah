"use server";

import { revalidatePath } from "next/cache";
import { isAdminUser } from "@/lib/auth/admin";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const quoteStatuses = [
  "new",
  "reviewing",
  "quoted",
  "accepted",
  "rejected",
  "converted",
] as const;

type QuoteStatus = (typeof quoteStatuses)[number];

async function getAdminClient() {
  const sessionClient = await createClient();
  if (sessionClient) return sessionClient;
  return createServiceClient();
}

export async function updateQuoteStatusAction(
  quoteId: string,
  status: QuoteStatus,
) {
  const admin = await isAdminUser();
  if (!admin) {
    return { ok: false as const, error: "Unauthorized" };
  }
  if (!quoteStatuses.includes(status)) {
    return { ok: false as const, error: "Invalid status" };
  }

  const supabase = await getAdminClient();
  if (!supabase) {
    return { ok: false as const, error: "Supabase not configured" };
  }

  const { error } = await supabase
    .from("quote_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", quoteId);

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/quotes");
  return { ok: true as const };
}

export { quoteStatuses };
