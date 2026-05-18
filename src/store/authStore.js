import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export const useAuth = create(
  persist(
    (set) => ({
      currentUser: null,
      loading: false,
      isAuthenticated: false,
      purchasedArticleIds: [],
      error: null,

      purchaseArticle: (articleId) => set((state) => ({ 
        purchasedArticleIds: [...new Set([...state.purchasedArticleIds, articleId])]
      })),

      login: async (userCredWithRole) => {
        const { role, ...userCredObj } = userCredWithRole;

        try {
          set({ loading: true, error: null });
          let res = await axios.post("http://localhost:4000/common-api/login", userCredObj, { withCredentials: true });
          
          set({
            loading: false,
            isAuthenticated: true,
            currentUser: res.data.payload,
            purchasedArticleIds: res.data.payload.purchasedArticles || [],
          });

          return res.data.payload;
        } catch (err) {
          console.log("err is ", err);
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data?.error || "Login failed",
          });
        }
      },

      logout: async () => {
        try {
          set({ loading: true, error: null });
          await axios.get("http://localhost:4000/common-api/logout", { withCredentials: true });
          localStorage.removeItem("user_activity"); // Clear activity on logout
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            purchasedArticleIds: [], // Reset on logout
          });
        } catch (err) {
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data?.error || "Logout failed",
          });
        }
      },

      checkAuth: async () => {
        try {
          const res = await axios.get("http://localhost:4000/common-api/check-auth", { withCredentials: true });

          set({
            currentUser: res.data.payload,
            isAuthenticated: true,
            purchasedArticleIds: res.data.payload.purchasedArticles || [],
            loading: false,
          });

        } catch (err) {
          if (err.response?.status === 401) {
            set({
              currentUser: null,
              isAuthenticated: false,
              purchasedArticleIds: [],
              loading: false,
            });
            return;
          }
          console.error("Auth check failed:", err);
        }
      },

      updateProfilePic: async (formData) => {
        try {
          set({ loading: true, error: null });
          const res = await axios.put("http://localhost:4000/common-api/update-profile-pic", formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          set({
            loading: false,
            currentUser: res.data.payload,
          });
          return res.data;
        } catch (err) {
          console.error("Profile pic update failed:", err);
          set({
            loading: false,
            error: err.response?.data?.message || "Failed to update profile picture",
          });
          throw err;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        purchasedArticleIds: state.purchasedArticleIds,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
