import { NextResponse } from "next/server";
import { runDailySocialPost } from "@/lib/social/run-daily";

function authorize(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Allow local/dev without secret; production should set CRON_SECRET.
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }
  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";

  try {
    const result = await runDailySocialPost({
      triggeredBy: force ? "manual" : "cron",
      force,
    });
    return NextResponse.json(result, {
      status: result.ok || result.skipped ? 200 : 500,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
