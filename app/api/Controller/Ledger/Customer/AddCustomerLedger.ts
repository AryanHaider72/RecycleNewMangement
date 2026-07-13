"use client";

import { getRequest, postRequest } from "@/app/api/Main/main";
import { CustomerLedgerAddRequest } from "@/app/api/Types/Ledger/CustomerLedger";

export default async function AddCustomerLedgerApi(
  data: CustomerLedgerAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Customer/Ledger/AddCustomerLedger`,
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
