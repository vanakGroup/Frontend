import { postData } from "@/services/services";

interface ReservationPayload {
  parking_id: string;
  vehicle_id: string;
  start_time: number;
  end_time: number;
}

export const createReservation = async (payload: ReservationPayload) => {
  return await postData({
    endPoint: "/v1/reservation",
    data: payload,
  });
};
