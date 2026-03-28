import { NextRequest, NextResponse } from "next/server";
import { decidePaymentRequest } from "@/lib/payment-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  const { requestId } = await params;
  const body = (await request.json()) as {
    status?: "approved" | "rejected";
    rejectionReason?: string;
  };

  if (body.status !== "approved" && body.status !== "rejected") {
    return NextResponse.json(
      { success: false, message: "Status must be approved or rejected." },
      { status: 400 },
    );
  }

  if (body.status === "rejected" && !body.rejectionReason?.trim()) {
    return NextResponse.json(
      { success: false, message: "Rejection reason is required." },
      { status: 400 },
    );
  }

  const updated = decidePaymentRequest(requestId, body.status, body.rejectionReason?.trim());
  if (!updated) {
    return NextResponse.json(
      { success: false, message: "Payment request not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, request: updated });
}
