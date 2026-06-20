export interface LoginPayload {
  phone: string;
}

export interface SendOTPPayload {
  phone: string;
}

export interface SendOTPResponse {
  data?: object;
  message: string;
  statusCode: number;
}

export interface VerifyOTPPayload {
  phone: string;
  otp: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    phone: string;
    role: "USER" | "ADMIN";
  };
}
