"use client";

import { postRequest } from "@/app/api/Main/main";
import { RequeestAddGeneralExpense } from "@/app/api/Types/module1/GeneralExpense";

interface AddEndProduct {
  endID: string;
  postingDate: string;
  remarks: string;
  scrapKG: number;
  productID: string;
  qty: number;
  costPrice: number;
  salePrice: number;
}

export default async function ModifyEndProductApi(
  data: AddEndProduct,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }
  const response = await postRequest(
    `/api/EndProduct/ModifyEndProduct`,
    data,
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
  };
}
