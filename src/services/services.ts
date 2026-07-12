// src/apiClient.ts
import useUserStore from "@/store/userStore/userStore";
import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type {
  DeleteParams,
  GetParams,
  PatchParams,
  PostParams,
  PutParams,
} from "../types/apiTypes";

export const baseURL = "https://vparking.ir"; // backend URL

const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);


export const getData = async ({ endPoint, headers, params }: GetParams) => {
  try {
    const response: AxiosResponse = await apiClient.get(endPoint, {
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("error in getData", error);
    throw error;
  }
};


export const postData = async ({ endPoint, data, headers }: PostParams) => {
  try {
    const response: AxiosResponse = await apiClient.post(endPoint, data, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("error in postData", error);
    throw error;
  }
};


export const postImageData = async ({ endPoint, data }: PostParams) => {
  try {
    const response: AxiosResponse = await apiClient.post(endPoint, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("error in postImageData", error);
    throw error;
  }
};


export const patchData = async ({ endPoint, data, headers }: PatchParams) => {
  try {
    const response: AxiosResponse = await apiClient.patch(endPoint, data, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("error in patchData", error);
    throw error;
  }
};


export const putData = async ({ endPoint, data }: PutParams) => {
  try {
    const response: AxiosResponse = await apiClient.put(endPoint, data);
    return response.data;
  } catch (error) {
    console.error("error in putData", error);
    throw error;
  }
};


export const deleteData = async ({ endPoint, data, headers }: DeleteParams) => {
  try {
    const response: AxiosResponse = await apiClient.delete(endPoint, {
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("error in deleteData", error);
    throw error;
  }
};
