import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    phoneNumber?: string;
    amountEtb?: number;
    psychiatristId?: string;
    appointmentDate?: string;
    appointmentTime?: string;
  };

  if (!body.phoneNumber || !body.amountEtb || !body.appointmentDate) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing payment payload. Include phone, amount, and appointment date.",
      },
      { status: 400 },
    );
  }

  const transactionCode = `MPESA-${Date.now()}`;

  return NextResponse.json({
    success: true,
    status: "completed",
    transactionCode,
    message: "M-Pesa STK Push simulation successful. Booking confirmed.",
    payment: {
      method: "mpesa",
      phoneNumber: body.phoneNumber,
      amountEtb: body.amountEtb,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      psychiatristId: body.psychiatristId,
    },
  });
}
