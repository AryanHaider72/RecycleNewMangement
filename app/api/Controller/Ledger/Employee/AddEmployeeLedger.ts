"use client";

interface datainterfacea {
  dateFrom: string;
  dateTo: string;
  empID: string;
}
import { getRequest, postRequest } from "@/app/api/Main/main";
import { EmployeeLedgerAddRequest } from "@/app/api/Types/Ledger/EmoployeeLedger";

export default async function AddEmployeeLedgerApi(
  data: EmployeeLedgerAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Employee/Ledger/AddEmployeeLedger`,
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
