import { getData } from "@/services/services";

export interface StaticItem {
  id: number;
  name: string;
}

export const getCities = async (): Promise<StaticItem[]> => {
  const res = await getData({ endPoint: "/v1/parking/static/cities" });
  return res.data;
};

export const getAttributes = async (): Promise<StaticItem[]> => {
  const res = await getData({ endPoint: "/v1/parking/static/attributes" });
  return res.data;
};
