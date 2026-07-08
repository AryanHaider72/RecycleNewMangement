import axios from "axios";

const api = axios.create({
  //baseURL: "https://sonuspk.premiermegamall.com/",
  baseURL: "http://localhost:9092/",
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
