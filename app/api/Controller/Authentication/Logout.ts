"use client";

import { getRequest } from "../../Main/main";

export default async function LogoutApi(token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/Authentication/logout`,
    null,
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
  };
}
