"use client";

import { getRequest } from "@/app/api/Main/main";

export default async function GetCashInFlowReportApi(
  dateFrom: string,
  dateTo: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }
  const response = await getRequest(
    `/api/Report/CashInFlowReport?dateFrom=${dateFrom}&dateTo=${dateTo}`,
    null,
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
    // message: response.message,
    // success: response.success,
    // error: responsea.error,
  };
}
