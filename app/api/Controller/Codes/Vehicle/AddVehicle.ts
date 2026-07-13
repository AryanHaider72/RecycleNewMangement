"use client";

import { postRequest } from "@/app/api/Main/main";
import { EmployeeAddRequest } from "@/app/api/Types/Codes/Employee/Employee";
import { VehicleAddRequest } from "@/app/api/Types/Codes/Vehicle/Vehicle";

export default async function VehicleAddApi(
  data: VehicleAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Vehicle/AddVehicle`,
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
