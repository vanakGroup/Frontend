import { getData } from "@/services/services";

export interface Vehicle {
  id: number;
  car_model: string;
  license_plate: string;
}

export const getMyVehicles = async (): Promise<Vehicle[]> => {
  const res = await getData({ endPoint: "/v1/vehicle" });
  return Array.isArray(res) ? res : res?.data || [];
};
