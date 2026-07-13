"use client";

import { postRequest } from "@/app/api/Main/main";
import { VehicleList } from "@/app/api/Types/Codes/Vehicle/Vehicle";

export default async function VehicleModifyApi(
  data: VehicleList,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Vehicle/ModifyVehicle`,
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
