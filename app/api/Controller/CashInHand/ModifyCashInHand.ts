"use client";

import { postRequest } from "@/app/api/Main/main";
interface AddAttendece {
  postingDate: string;
  amount: number;
  remarks: string;
  cashID: string;
}

export default async function ModifyCashInHandApi(
  data: AddAttendece,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/CashinHand/ModifyCashinHand`,
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
