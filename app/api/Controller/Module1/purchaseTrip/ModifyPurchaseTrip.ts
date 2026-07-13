"use client";

import { postRequest } from "@/app/api/Main/main";
import { ModifyPurchaseTripRequest } from "@/app/api/Types/module1/purchaseTrip";

export default async function PurchaseTripModifyApi(
  data: ModifyPurchaseTripRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }
  const response = await postRequest(
    `/api/PurchaseTrip/ModifyPurchaseTrip`,
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
