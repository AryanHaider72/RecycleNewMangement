"use client";

import { getRequest, postRequest } from "@/app/api/Main/main";
import { BankLedgerAddRequest } from "@/app/api/Types/Ledger/BankLedger";
export default async function AddBankLedgerApi(
  data: BankLedgerAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Bank/Ledger/AddBankLedger`,
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
