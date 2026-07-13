"use client";

import { postRequest } from "@/app/api/Main/main";
import { BankAddRequest, BankList } from "@/app/api/Types/Codes/Bank/Bank";

export default async function BankModifyApi(data: BankList, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Bank/ModifyBank`,
    data,
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
