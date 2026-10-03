"use client";

import { postRequest } from "@/app/api/Main/main";
import { AddRequestSalryLabour } from "@/app/api/Types/module1/LaboutSalary";

export default async function AddLabourApi(
  data: AddRequestSalryLabour,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }
  const response = await postRequest(
    `/api/Labour/AddEmployeeSalary`,
    data,
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
