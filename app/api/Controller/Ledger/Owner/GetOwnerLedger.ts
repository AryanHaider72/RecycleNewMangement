"use client";

interface datainterfacea {
  dateFrom: string;
  dateTo: string;
  ownerID: string;
}
import { postRequest } from "@/app/api/Main/main";

export default async function GetOwnerLedgerApi(
  data: datainterfacea,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Owner/Ledger/GetOwnerLedger`,
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
