"use client";

import { postRequest } from "@/app/api/Main/main";
interface AddAttendece {
  postingDate: string;
  employeeID: string;
  status: string;
  description: string;
}

export default async function AttendenceAddApi(
  data: AddAttendece,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Attendance/AddAttendance`,
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
