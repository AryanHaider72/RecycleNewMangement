"use client";

import { postRequest } from "@/app/api/Main/main";
import { AddSaleRequest } from "@/app/api/Types/module1/SaleModuel";

export default async function SaleAddApi(data: AddSaleRequest, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }
  const response = await postRequest(`/api/Sale/AddSale`, data, customHeader);

  return {
    data: response.data,
    status: response.status,
    // message: response.message,
    // success: response.success,
    // error: responsea.error,
  };
}
