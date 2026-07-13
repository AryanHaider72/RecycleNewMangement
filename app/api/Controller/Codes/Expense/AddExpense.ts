"use client";

import { postRequest } from "@/app/api/Main/main";
import { ExpenseAddRequest } from "@/app/api/Types/Codes/Expense/Expense";

export default async function ExpenseAddApi(
  data: ExpenseAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Expense/AddExpense`,
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
