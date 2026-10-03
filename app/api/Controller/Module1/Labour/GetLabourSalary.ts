"use client";

import { postRequest } from "@/app/api/Main/main";

export default async function GetLabourApi(date: string, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }
  const response = await postRequest(
    `/api/Labour/GetEmployeeDataSalary?date=${date}`,
    null,
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
    // message: response.message,
    // success: response.success,
    // error: responsea.error,
  };
}
