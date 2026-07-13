"use client";

import { getRequest, postRequest } from "@/app/api/Main/main";
import { OwnerLedgerAddRequest } from "@/app/api/Types/Ledger/OwnerLedger";
export default async function AddOwnerLedgerApi(
  data: OwnerLedgerAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Owner/Ledger/AddOwnerLedger`,
    data,
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
