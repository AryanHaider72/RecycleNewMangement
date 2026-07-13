"use client";

import { getRequest, postRequest } from "@/app/api/Main/main";
import { OwnerLedgerModifyRequest } from "@/app/api/Types/Ledger/OwnerLedger";
export default async function ModifyOwnerLedgerApi(
  data: OwnerLedgerModifyRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Owner/Ledger/ModifyOwnerLedger`,
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
