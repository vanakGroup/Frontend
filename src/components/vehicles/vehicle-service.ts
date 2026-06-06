import { deleteData, getData, postImageData } from "@/services/services";
import type { Vehicle } from "@/types/vehicleTypes";
import { toast } from "sonner";

export interface CreateVehiclePayload {
  license_plate: string;
  car_model: string;
  registration_card: File;
}

interface GetVehiclesResponse {
  statusCode: number;
  message: string;
  data: Array<{
    id: number;
    license_plate: string;
    car_model: string;
  }>;
}

interface GetVehicleByIdResponse {
  statusCode: number;
  message: string;
  data: {
    license_plate: string;
    car_model: string;
    registration_card_url?: string;
  };
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = (await getData({
      endPoint: "/v1/vehicle",
    })) as GetVehiclesResponse;

    return response.data.map((vehicle) => ({
      id: String(vehicle.id),
      license_plate: vehicle.license_plate,
      car_model: vehicle.car_model,
    }));
  } catch (error) {
    toast.error("دریافت لیست وسایل نقلیه ناموفق بود", {
      description: "لطفاً دوباره تلاش کنید.",
    });
    throw error;
  }
};

export const getVehicleById = async (id: string): Promise<Vehicle> => {
  try {
    const response = (await getData({
      endPoint: `/v1/vehicle/${id}`,
    })) as GetVehicleByIdResponse;

    return {
      id,
      license_plate: response.data.license_plate,
      car_model: response.data.car_model,
      registration_card: response.data.registration_card_url,
    };
  } catch (error) {
    toast.error("دریافت اطلاعات وسیله نقلیه ناموفق بود", {
      description: "لطفاً دوباره تلاش کنید.",
    });
    throw error;
  }
};

export const deleteVehicle = async (id: string) => {
  try {
    const response = await deleteData({
      endPoint: `/v1/vehicle/${id}`,
    });

    toast.success("وسیله نقلیه با موفقیت حذف شد", {
      description: response?.message ?? "",
    });

    return response;
  } catch (error) {
    toast.error("حذف وسیله نقلیه ناموفق بود", {
      description: "لطفاً دوباره تلاش کنید.",
    });
    throw error;
  }
};

export const createVehicle = async ({
  license_plate,
  car_model,
  registration_card,
}: CreateVehiclePayload) => {
  const formData = new FormData();
  formData.append("license_plate", license_plate);
  formData.append("car_model", car_model);
  formData.append("registration_card", registration_card);

  try {
    const response = await postImageData({
      endPoint: "/v1/vehicle",
      data: formData,
    });

    toast.success("وسیله نقلیه با موفقیت ثبت شد", {
      description: response?.message ?? "",
    });

    return response;
  } catch (error) {
    toast.error("ثبت وسیله نقلیه ناموفق بود", {
      description: "لطفاً دوباره تلاش کنید.",
    });
    throw error;
  }
};
