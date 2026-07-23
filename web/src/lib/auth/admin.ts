import { createClient } from "@/lib/supabase/server";

export async function getSessionUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function isAdminUser() {
  if (process.env.ADMIN_DEMO_MODE === "true") return true;

  const user = await getSessionUser();
  if (!user) return false;
  const supabase = await createClient();
  if (!supabase) return process.env.ADMIN_EMAIL === user.email;
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return data?.role === "admin" || data?.role === "staff";
}
