import { NextResponse } from "next/server";
import { listPaymentRequests } from "@/lib/payment-store";

export async function GET() {
  return NextResponse.json({
    success: true,
    requests: listPaymentRequests(),
  });
}
