"use client";
import { postRequest } from "@/app/api/Main/main";

export default async function DeleteOwnerLedgerApi(
  ledgerID: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Owner/Ledger/DeleteOwnerLedger?ledgerID=${ledgerID}`,
    {},
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
    // message: response.message,
    // success: response.success,
    // error: response.error,
  };
}
