"use client";

import { postRequest } from "@/app/api/Main/main";
import { labourList } from "@/app/api/Types/Codes/Labour/labour";

export default async function LabourModifyApi(
  data: labourList,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Labour/ModifyLabour`,
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
