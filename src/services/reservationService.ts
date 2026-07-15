import { getData, postData } from "@/services/services";
import CustomToast from "@/components/Custom/CustomToast";
import type { ReservationDTO } from "@/types/reservation";
import type { Response } from "./parkingService";

interface ReservationPayload {
  parking_id: string;
  vehicle_id: string;
  start_time: number;
  end_time: number;
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

export const createReservation = async (payload: ReservationPayload) => {
  return await postData({
    endPoint: "/v1/reservation",
    data: payload,
  });
};

export const reservationService = {
  async getParkingReservations(
    parkingId: string,
  ): Promise<Response<ReservationDTO[]>> {
    return getData({ endPoint: `/v1/parking/${parkingId}/reservation` });
  },

  async getVehicleReservations(
    vehicleId: string,
  ): Promise<Response<ReservationDTO[]>> {
    return getData({ endPoint: `/v1/vehicle/${vehicleId}/reservation` });
  },

  async getReservationDetail(
    parkingId: string,
    reserveId: string,
  ): Promise<Response<ReservationDTO>> {
    return getData({
      endPoint: `/v1/parking/${parkingId}/reservation/${reserveId}`,
    });
  },

  async settleReservation(
    parkingId: string,
    reserveId: string,
  ): Promise<Response<null>> {
    try {
      return await postData({
        endPoint: `/v1/parking/${parkingId}/reservation/${reserveId}/settle`,
        data: {},
      });
    } catch (error) {
      CustomToast.error(extractApiError(error));
      throw error;
    }
  },
};
