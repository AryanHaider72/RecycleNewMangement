"use client";

import { postRequest } from "@/app/api/Main/main";
import { CustomerLedgerModifyRequest } from "@/app/api/Types/Ledger/CustomerLedger";

export default async function ModifyCustomerLedgerApi(
  data: CustomerLedgerModifyRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Customer/Ledger/ModifyCustomerLedger`,
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
