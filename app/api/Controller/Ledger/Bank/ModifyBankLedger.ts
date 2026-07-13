"use client";

import { postRequest } from "@/app/api/Main/main";
import { BankLedgerModifyRequest } from "@/app/api/Types/Ledger/BankLedger";

export default async function ModifyBankLedgerApi(
  data: BankLedgerModifyRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Bank/Ledger/ModifyBankLedger`,
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
