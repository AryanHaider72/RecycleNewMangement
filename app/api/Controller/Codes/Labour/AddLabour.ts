"use client";

import { postRequest } from "@/app/api/Main/main";
import { LabourAddRequest } from "@/app/api/Types/Codes/Labour/labour";

export default async function LabourAddApi(
  data: LabourAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Labour/AddLabour`,
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
