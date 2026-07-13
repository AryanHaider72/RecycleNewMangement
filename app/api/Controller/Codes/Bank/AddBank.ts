"use client";

import { postRequest } from "@/app/api/Main/main";
import { BankAddRequest } from "@/app/api/Types/Codes/Bank/Bank";

export default async function BankAddApi(data: BankAddRequest, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(`/api/Bank/AddBank`, data, customHeader);

  return {
    data: response.data,
    status: response.status,
    // message: response.message,
    // success: response.success,
    // error: responsea.error,
  };
}
