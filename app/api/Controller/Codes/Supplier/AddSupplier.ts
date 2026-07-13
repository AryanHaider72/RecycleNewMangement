"use client";

import { postRequest } from "@/app/api/Main/main";
import { SupplierAddRequest } from "@/app/api/Types/Codes/Supplier/Supplier";

export default async function SupplierAddApi(
  data: SupplierAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Supplier/AddSupplier`,
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
