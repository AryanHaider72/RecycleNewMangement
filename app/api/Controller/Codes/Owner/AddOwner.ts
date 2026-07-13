"use client";

import { postRequest } from "@/app/api/Main/main";
import { OwnerAddRequest } from "@/app/api/Types/Codes/Owner/Owner";

export default async function OwnerAddApi(
  data: OwnerAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(`/api/Owner/AddOwner`, data, customHeader);

  return {
    data: response.data,
    status: response.status,
    // message: response.message,
    // success: response.success,
    // error: response.error,
  };
}
