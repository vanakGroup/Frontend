import {
  getData,
  postImageData,
  deleteData,
  putImageData,
} from "./services";
import CustomToast from "@/components/Custom/CustomToast";
import type {
  ParkingListResponse,
  ParkingDetailResponse,
  StaticItem,
} from "@/types/parking";

export interface Response<T> {
  data: T | null;
  message: string | Record<string, Record<string, string>>;
  statusCode: string | number;
}

function extractApiError(error: unknown): string {
  const message = (error as { response?: { data?: { message?: unknown } } })
    ?.response?.data?.message;

  if (message && typeof message === "object") {
    const messages: string[] = [];
    Object.entries(message).forEach(([, rules]) => {
      if (rules && typeof rules === "object") {
        Object.values(rules as Record<string, string>).forEach((m) => {
          if (m) messages.push(m);
        });
      }
    });
    if (messages.length > 0) return messages.join("\n");
  }

  if (typeof message === "string" && message.trim()) return message;

  return "خطا در ارتباط با سرور";
}

export const parkingService = {
  async getUserParkings(): Promise<Response<ParkingListResponse[]>> {
    return getData({ endPoint: "/v1/parking" });
  },

  async getParkingDetail(id: string): Promise<Response<ParkingDetailResponse>> {
    return getData({ endPoint: `/v1/parking/crud/parkingDetail/${id}` });
  },

  async createParking(formData: FormData): Promise<Response<unknown>> {
    try {
      return await postImageData({
        endPoint: "/v1/parking/crud/create",
        data: formData,
      });
    } catch (error) {
      CustomToast.error(extractApiError(error));
      throw error;
    }
  },

  async updateParking(formData: FormData): Promise<Response<unknown>> {
    try {
      return await putImageData({
        endPoint: "/v1/parking/crud/update",
        data: formData,
      });
    } catch (error) {
      CustomToast.error(extractApiError(error));
      throw error;
    }
  },

  async deleteParking(id: string): Promise<Response<unknown>> {
    try {
      return await deleteData({ endPoint: `/v1/parking/crud/delete/${id}` });
    } catch (error) {
      CustomToast.error(extractApiError(error));
      throw error;
    }
  },

  async getCities(): Promise<Response<StaticItem[]>> {
    return getData({ endPoint: "/v1/parking/static/cities" });
  },

  async getAttributes(): Promise<Response<StaticItem[]>> {
    return getData({ endPoint: "/v1/parking/static/attributes" });
  },
};
