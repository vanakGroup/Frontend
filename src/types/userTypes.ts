export interface UserState {
  username: string | null;
  phone: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
  role: "USER" | "ADMIN" | null;
  setRememberMe: (rememberMe: boolean) => void;

  // Actions
  setUsername: (username: string) => void;
  setAuthData: (data: {
    phone: string;
    accessToken: string;
    refreshToken: string;
    role: "USER" | "ADMIN";
  }) => void;
  clearAuth: () => void;
}
