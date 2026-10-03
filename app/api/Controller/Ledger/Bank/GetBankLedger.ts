"use client";

interface datainterfacea {
  dateFrom: string;
  dateTo: string;
  bankID: string;
}
import { getRequest } from "@/app/api/Main/main";

export default async function GetBankLedgerApi(
  data: datainterfacea,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/Bank/Ledger/GetBankLedger?bankID=${data.bankID}&dateFrom=${data.dateFrom}&dateTo=${data.dateTo}&`,
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
