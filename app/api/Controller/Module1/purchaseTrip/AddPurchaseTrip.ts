"use client";

import { getRequest, postRequest } from "@/app/api/Main/main";
import { AddPurchaseTripRequest } from "@/app/api/Types/module1/purchaseTrip";

export default async function PurchaseTripAddApi(
  data: AddPurchaseTripRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }
  const response = await postRequest(
    `/api/PurchaseTrip/AddPurchaseTrip`,
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
