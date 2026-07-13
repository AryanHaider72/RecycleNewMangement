"use client";

import { postRequest } from "@/app/api/Main/main";
import { vehicleLedgerModifyRequest } from "@/app/api/Types/Ledger/VehicleLedger";

export default async function ModifyVehicleLedgerApi(
  data: vehicleLedgerModifyRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Vehicle/Ledger/ModifyVehicleLedger`,
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
