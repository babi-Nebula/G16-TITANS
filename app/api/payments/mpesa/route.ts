import { NextRequest, NextResponse } from "next/server";
import { createPaymentRequest } from "@/lib/payment-store";

function buildTimestamp() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}${hh}${min}${ss}`;
}

function normalizePhoneNumber(input: string) {
  return input.replace(/[^\d]/g, "");
}

async function getAccessTokenFromOAuth() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    return null;
  }

  const oauthUrl =
    process.env.MPESA_OAUTH_URL ??
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const response = await fetch(oauthUrl, {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  const payload = (await response.json()) as { access_token?: string };
  if (!response.ok || !payload.access_token) {
    return null;
  }

  return payload.access_token;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    payerName?: string;
    phoneNumber?: string;
    amountEtb?: number;
    accountReference?: string;
    transactionDesc?: string;
  };

  if (!body.phoneNumber || !body.amountEtb) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing payment payload. Include phone and amount.",
      },
      { status: 400 },
    );
  }

  const directToken = process.env.MPESA_API_KEY;
  const stkPushUrl = process.env.MPESA_STK_PUSH_URL;
  const businessShortCode = process.env.MPESA_BUSINESS_SHORT_CODE ?? "6564";
  const password = process.env.MPESA_PASSWORD;
  const callbackUrl =
    process.env.MPESA_CALLBACK_URL ??
    "https://webhook.site/852f46fe-65c6-406a-9466-06fce89d67a2";

  if (!stkPushUrl || !password) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Missing M-Pesa configuration. Set MPESA_STK_PUSH_URL and MPESA_PASSWORD in .env.local",
      },
      { status: 500 },
    );
  }

  const oauthToken = await getAccessTokenFromOAuth();
  const accessToken = oauthToken ?? directToken;
  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Missing M-Pesa access token. Provide MPESA_API_KEY (direct bearer token) or MPESA_CONSUMER_KEY + MPESA_CONSUMER_SECRET.",
      },
      { status: 500 },
    );
  }

  const normalizedPhone = normalizePhoneNumber(body.phoneNumber);
  if (!normalizedPhone) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid phone number format.",
      },
      { status: 400 },
    );
  }

  const merchantRequestId = `mindcare-${crypto.randomUUID()}`;
  const timestamp = buildTimestamp();
  const payload = {
    MerchantRequestID: merchantRequestId,
    BusinessShortCode: businessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: body.amountEtb,
    PartyA: normalizedPhone,
    PartyB: businessShortCode,
    PhoneNumber: normalizedPhone,
    CallBackURL: callbackUrl,
    AccountReference: body.accountReference ?? "MindCare",
    TransactionDesc: body.transactionDesc ?? "MindCare Payment",
    ReferenceData: [
      {
        Key: "CashierName",
        Value: body.payerName ?? "MindCare User",
      },
    ],
  };

  let mpesaResponse: unknown;
  let responseText = "";
  try {
    const mpesaRequest = await fetch(stkPushUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    responseText = await mpesaRequest.text();
    try {
      mpesaResponse = responseText ? JSON.parse(responseText) : {};
    } catch {
      mpesaResponse = { raw: responseText };
    }

    if (!mpesaRequest.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `M-Pesa request failed with status ${mpesaRequest.status}.`,
          error: mpesaResponse,
        },
        { status: 502 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to reach M-Pesa endpoint.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }

  const stored = createPaymentRequest({
    payerName: body.payerName ?? "MindCare User",
    phoneNumber: normalizedPhone,
    amountEtb: body.amountEtb,
    merchantRequestId,
    transactionType: "CustomerPayBillOnline",
    accountReference: body.accountReference ?? "MindCare",
    transactionDesc: body.transactionDesc ?? "MindCare Payment",
    rawResponse: mpesaResponse,
  });

  return NextResponse.json({
    success: true,
    status: "pending_admin_approval",
    request: stored,
    message:
      "M-Pesa STK Push submitted successfully. Admin can now review this payment request.",
  });
}
