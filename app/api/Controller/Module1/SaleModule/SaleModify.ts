"use client";

import { postRequest } from "@/app/api/Main/main";
import { SaleList } from "@/app/api/Types/module1/SaleModuel";

export default async function SaleModifyApi(data: SaleList, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }
  const response = await postRequest(
    `/api/Sale/ModifySale`,
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
