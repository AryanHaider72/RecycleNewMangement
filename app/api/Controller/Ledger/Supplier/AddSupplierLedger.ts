"use client";

import { postRequest } from "@/app/api/Main/main";
import { SupplierLedgerAddRequest } from "@/app/api/Types/Ledger/SupplierLedger";

export default async function AddSupplierLedgerApi(
  data: SupplierLedgerAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Supplier/Ledger/AddSupplierLedger`,
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
