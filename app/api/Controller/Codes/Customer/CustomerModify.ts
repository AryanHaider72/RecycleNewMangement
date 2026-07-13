"use client";

import { postRequest } from "@/app/api/Main/main";
import { CustomerList } from "@/app/api/Types/Codes/Customer/Customer";

export default async function CustomerModifyApi(
  data: CustomerList,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Customer/ModifyCustomer`,
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
