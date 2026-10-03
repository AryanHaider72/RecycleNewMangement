import axios from "axios";

const api = axios.create({
  baseURL: "http://182.191.80.195:9095/",
  //baseURL: "http://localhost:9095/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

async function getRequest<T>(
  url: string,
  params?: any,
  headers?: Record<string, string>,
) {
  try {
    const response = await api.get(url, {
      params,
      headers,
    });

    return response;
  } catch (error: any) {
    return error.response;
  }
}

async function postRequest<T>(
  url: string,
  data: any,
  headers?: Record<string, string>,
) {
  try {
    const response = await api.post(url, data, {
      headers,
    });

    return response;
  } catch (error: any) {
    return error.response;
  }
}

export default api;
export { getRequest, postRequest };
