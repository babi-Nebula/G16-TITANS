import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    userName?: string;
    phoneNumber?: string;
    language?: string;
  };

  return NextResponse.json({
    success: true,
    ticketId: `SOS-${Date.now()}`,
    message:
      "SOS alert simulation sent. Stay where you are safe. A support responder has been notified.",
    details: {
      userName: body.userName ?? "Unknown",
      phoneNumber: body.phoneNumber ?? "Unknown",
      language: body.language ?? "en",
      channel: "mock-sms",
    },
  });
}
