import {
  getData,
  postImageData,
  putImageData,
  deleteData,
} from "@/services/services";

export const getMyParkings = async () => {
  return await getData({
    endPoint: "/v1/parking",
  });
};

export const getParkingInfo = async (id: number | string) => {
  return await getData({
    endPoint: `/v1/parking/parkingInfo/${id}`,
  });
};

export const createParking = async (formData: FormData) => {
  return await postImageData({
    endPoint: "/v1/parking/crud/create",
    data: formData,
  });
};

export const updateParking = async (formData: FormData) => {
  return await putImageData({
    endPoint: "/v1/parking/crud/update",
    data: formData,
  });
};

/*export const getParkingById = async (id: number) => {
  return await getData({
    endPoint: `/v1/parking/crud/${id}`,
  });
};*/

export const deleteParking = async (id: string | number) => {
  return await deleteData({
    endPoint: `/v1/parking/crud/${id}`,
  });
};
