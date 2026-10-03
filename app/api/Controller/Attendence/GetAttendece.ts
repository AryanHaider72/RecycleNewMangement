"use client";

import { postRequest } from "@/app/api/Main/main";
interface AddAttendece {
  dateFrom: string;
  dateTo: string;
}

export default async function AttendenceGetApi(
  data: AddAttendece,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Attendance/GetAttendance?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
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
