"use client";

import { getRequest, postRequest } from "@/app/api/Main/main";
import { OwnerList } from "@/app/api/Types/Codes/Owner/Owner";

export default async function OwnerGetApi(token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(`/api/Owner/GetOwner`, null, customHeader);

  return {
    data: response.data,
    status: response.status,
    // message: response.message,
    // success: response.success,
    // error: response.error,
  };
}
