"use client";

import { postRequest } from "@/app/api/Main/main";
import { RequeestAddGeneralExpense } from "@/app/api/Types/module1/GeneralExpense";

export default async function GeneralExpenseAddApi(
  data: RequeestAddGeneralExpense,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }
  const response = await postRequest(
    `/api/Expense/GeneralExpense/AddGeneralExpense`,
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
