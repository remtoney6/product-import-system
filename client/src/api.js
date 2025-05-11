import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
  withCredentials: true,
});

// Interceptor to fetch CSRF token before requests
api.interceptors.request.use(async (config) => {
    if (config.method !== "get" && !config.url.includes("sanctum/csrf-cookie")) {
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
    }
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

// Interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "An error occurred. Please try again.";
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;