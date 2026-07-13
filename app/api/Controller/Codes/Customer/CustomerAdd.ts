"use client";

import { postRequest } from "@/app/api/Main/main";
import { CustomerAddRequest } from "@/app/api/Types/Codes/Customer/Customer";

export default async function CustomerAddApi(
  data: CustomerAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Customer/AddCustomer`,
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
