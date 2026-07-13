"use client";

import { postRequest } from "@/app/api/Main/main";
import { SupplierList } from "@/app/api/Types/Codes/Supplier/Supplier";

export default async function SupplierModifyApi(
  data: SupplierList,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Supplier/ModifySupplier`,
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
