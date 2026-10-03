"use client";

import { getRequest } from "@/app/api/Main/main";

export default async function TotalScrapAvaliableApi(token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }
  const response = await getRequest(
    `/api/EndProduct/GetTotalScrap`,
    null,
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
  };
}
