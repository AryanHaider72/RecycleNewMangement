"use client";

import { postRequest } from "@/app/api/Main/main";
import { SupplierLedgerModifyRequest } from "@/app/api/Types/Ledger/SupplierLedger";

export default async function DeleteSupplierLedgerApi(
  ledgerID: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Supplier/Ledger/DeleteSupplierLedger?ledgerID=${ledgerID}`,
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
