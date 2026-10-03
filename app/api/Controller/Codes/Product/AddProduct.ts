"use client";

import { postRequest } from "@/app/api/Main/main";
import { ProductAddRequest } from "@/app/api/Types/Codes/Product/Product";

export default async function ProductAddApi(
  data: ProductAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Product/AddProduct`,
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
