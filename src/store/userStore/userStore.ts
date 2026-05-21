import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserState } from "../../types/userTypes";
import type { StateStorage } from "zustand/middleware";

const dynamicStorage: StateStorage = {
  getItem: (name) => {
    return localStorage.getItem(name) || sessionStorage.getItem(name);
  },
  setItem: (name, value) => {
    const parsedState = JSON.parse(value);
    const isRemembered = parsedState.state.rememberMe;

    if (isRemembered) {
      localStorage.setItem(name, value);
      sessionStorage.removeItem(name);
    } else {
      sessionStorage.setItem(name, value);
      localStorage.removeItem(name);
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: null,
      phone: null,
      accessToken: null,
      refreshToken: null,
      rememberMe: false,

      setRememberMe: (rememberMe) => set({ rememberMe }),

      setUsername: (username) => set({ username }),

      setAuthData: (data) =>
        set({
          phone: data.phone,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),

      clearAuth: () =>
        set({
          username: null,
          phone: null,
          accessToken: null,
          refreshToken: null,
          rememberMe: false,
        }),
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => dynamicStorage), // 2. Attach it here
    },
  ),
);

export default useUserStore;
