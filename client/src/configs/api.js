import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (expired/invalid token)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      // Prevent redirect loop - don't redirect if already on login page
      if (currentPath !== "/login" && !currentPath.startsWith("/login")) {
        // Clear token from localStorage
        localStorage.removeItem("token");

        // Show user-friendly message
        const message =
          error.response?.data?.message ||
          "Session expired. Please login again.";
        toast.error(message);

        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }

    // Handle network errors
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  },
);

export default api;
