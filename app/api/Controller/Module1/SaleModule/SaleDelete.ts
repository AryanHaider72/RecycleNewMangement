"use client";

import { postRequest } from "@/app/api/Main/main";

export default async function SaleDeleteApi(saleID: string, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }
  const response = await postRequest(
    `/api/Sale/DeleteSale?saleID=${saleID}`,
    {},
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
