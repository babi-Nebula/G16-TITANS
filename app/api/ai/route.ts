import { NextRequest, NextResponse } from "next/server";

const supportiveReplies = [
  "Thank you for sharing. A small step today is enough. Try one minute of slow breathing.",
  "Your feelings are valid. Consider writing down one worry and one thing you can control now.",
  "You are not alone. Reaching out for support shows strength and self-awareness.",
  "Let's ground together: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
];

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { message?: string; language?: string };
  const message = body.message?.toLowerCase() ?? "";

  let reply = supportiveReplies[Math.floor(Math.random() * supportiveReplies.length)];

  if (message.includes("suicide") || message.includes("harm") || message.includes("die")) {
    reply =
      "I am glad you reached out. Please use the SOS button now and contact immediate local support. You deserve urgent human care.";
  }

  return NextResponse.json({
    success: true,
    reply,
    language: body.language ?? "en",
    sentiment: message.includes("sad") || message.includes("stress") ? "low-mood" : "neutral",
  });
}
