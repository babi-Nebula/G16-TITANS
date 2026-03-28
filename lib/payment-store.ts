export type PaymentRequestStatus = "pending" | "approved" | "rejected";

export interface PaymentRequestRecord {
  id: string;
  payerName: string;
  phoneNumber: string;
  amountEtb: number;
  merchantRequestId: string;
  transactionType: string;
  accountReference: string;
  transactionDesc: string;
  status: PaymentRequestStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  rawResponse?: unknown;
}

const paymentRequests: PaymentRequestRecord[] = [];

export function listPaymentRequests() {
  return [...paymentRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function createPaymentRequest(
  input: Omit<PaymentRequestRecord, "id" | "createdAt" | "updatedAt" | "status">,
) {
  const now = new Date().toISOString();
  const record: PaymentRequestRecord = {
    id: `req-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  paymentRequests.unshift(record);
  return record;
}

export function decidePaymentRequest(
  id: string,
  status: Extract<PaymentRequestStatus, "approved" | "rejected">,
  rejectionReason?: string,
) {
  const existing = paymentRequests.find((request) => request.id === id);
  if (!existing) {
    return null;
  }

  existing.status = status;
  existing.updatedAt = new Date().toISOString();
  existing.rejectionReason = status === "rejected" ? rejectionReason : undefined;
  return existing;
}
