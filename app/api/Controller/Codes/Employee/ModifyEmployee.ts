"use client";

import { postRequest } from "@/app/api/Main/main";
import { employeeList } from "@/app/api/Types/Codes/Employee/Employee";

export default async function EmployeeModifyApi(
  data: employeeList,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Employee/ModifyEmployee`,
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
