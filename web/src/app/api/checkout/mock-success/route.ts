import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const order = searchParams.get("order") ?? "MAF-DEMO-0001";
  return NextResponse.redirect(
    new URL(`/en/orders/${order}?success=1&mock=1`, request.url),
  );
}
