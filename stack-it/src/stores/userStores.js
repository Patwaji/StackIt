import { create } from "zustand";
import { userDetailsUrl } from "@/lib/API";
import axios from "axios";
import { toast } from "sonner";

export const useUserStore = create((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (userData) => set({ user: userData, isLoggedIn: true }),
  clearUser: () => set({ user: null, isLoggedIn: false }),

  fetchUser: async (token) => {
    try {
      const res = await axios.get(userDetailsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ user: res.data, isLoggedIn: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        set({ user: null, isLoggedIn: false });
        toast.error("Your session has expired. Please log in again.");
      } else {
        toast.error("Failed to fetch user data.");
      }
    }
  },
}));
