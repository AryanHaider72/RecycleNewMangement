"use client";

import { getRequest, postRequest } from "@/app/api/Main/main";
import { OwnerLedgerAddRequest } from "@/app/api/Types/Ledger/OwnerLedger";
import { vehicleLedgerAddRequest } from "@/app/api/Types/Ledger/VehicleLedger";
export default async function AddVehicleLedgerApi(
  data: vehicleLedgerAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Vehicle/Ledger/AddVehicleLedger`,
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
