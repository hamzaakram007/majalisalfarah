import { createServiceClient } from "@/lib/supabase/server";
import {
  getMockProducts,
  loyaltySettings,
} from "@/lib/data/mock";

export async function getAdminStats() {
  const supabase = await createServiceClient();
  if (!supabase) {
    const products = getMockProducts("en");
    return {
      orders: 0,
      revenue: 0,
      quotes: 0,
      callbacks: 0,
      products: products.length,
    };
  }

  const [orders, quotes, callbacks, products] = await Promise.all([
    supabase.from("orders").select("total_sar, status"),
    supabase.from("quote_requests").select("id", { count: "exact", head: true }),
    supabase.from("callback_requests").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }),
  ]);

  const orderRows = orders.data ?? [];
  const revenue = orderRows
    .filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((s, o) => s + Number(o.total_sar), 0);

  return {
    orders: orderRows.length,
    revenue,
    quotes: quotes.count ?? 0,
    callbacks: callbacks.count ?? 0,
    products: products.count ?? 0,
    loyalty: loyaltySettings,
  };
}

export async function getAdminOrders() {
  const supabase = await createServiceClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, total_sar, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

export async function getAdminQuotes() {
  const supabase = await createServiceClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

export async function getAdminCallbacks() {
  const supabase = await createServiceClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("callback_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

export async function getAdminProducts() {
  const supabase = await createServiceClient();
  if (!supabase) return getMockProducts("en");
  const { data } = await supabase
    .from("products")
    .select("id, slug, price_sar, stock, is_active, is_featured")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminPayments() {
  const supabase = await createServiceClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("payments")
    .select("id, order_id, amount_sar, status, provider, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}
