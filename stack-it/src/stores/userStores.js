import { create } from "zustand";
import { userDetailsUrl } from "@/lib/API";

export const useUserStore = create((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (userData) => set({ user: userData, isLoggedIn: true }),
  clearUser: () => set({ user: null, isLoggedIn: false }),

  fetchUser: async (token) => {
    try {
      const res = await fetch(userDetailsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      set({ user: data, isLoggedIn: true });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  },
}));
