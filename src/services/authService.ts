// src/services/authService.ts

import type {
  LoginPayload,
  LoginResponse,
  SendOTPPayload,
  SendOTPResponse,
  VerifyOTPPayload,
} from "../types/authTypes";
import { postData } from "./services";

export const sendOTPService = async (
  payload: SendOTPPayload,
): Promise<SendOTPResponse> => {
  return postData({
    endPoint: `/v1/auth/send-otp`,
    data: payload,
  });
};

export const verifyOTPService = async (payload: VerifyOTPPayload) => {
  return postData({
    endPoint: `/v1/auth/verify-otp`,
    data: payload,
  });
};

export const loginService = async (payload: {
  phone: string;
}): Promise<LoginResponse> => {
  return postData({
    endPoint: `/v1/auth/login`,
    data: payload,
  });
};
