"use client";

import { getRequest, postRequest } from "@/app/api/Main/main";
import { CustomerList } from "@/app/api/Types/Codes/Customer/Customer";

export default async function CustomerGetApi(token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/Customer/GetCustomer`,
    null,
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
