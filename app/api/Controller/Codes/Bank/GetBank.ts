"use client";

import { getRequest, postRequest } from "@/app/api/Main/main";
import { BankAddRequest, BankList } from "@/app/api/Types/Codes/Bank/Bank";

export default async function BankGetApi(token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(`/api/Bank/GetBank`, null, customHeader);

  return {
    data: response.data,
    status: response.status,
    // message: response.message,
    // success: response.success,
    // error: responsea.error,
  };
}
