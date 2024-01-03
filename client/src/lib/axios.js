import axios from "axios";

const axiosOptions = {
  baseURL: "http://localhost:5000/",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

const axiosInstance = axios.create(axiosOptions);

axiosInstance.interceptors.request.use((config) => ({
  ...config,
  headers: {
    ...config.headers,
  },
}));

axiosInstance.interceptors.response.use(
  (response) => response, // handle successful responses
  async (error) => {
    const originalRequest = error.config;
    console.log("originalRequest", originalRequest);
    console.log("error", error.response);
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Token expired" &&
      !originalRequest._retry
    ) {
      try {
        originalRequest._retry = true;
        await axiosInstance.get("auth/refresh");
        return axiosInstance(originalRequest);
      } catch (error) {
        console.log("axios Error", error);
      }
    }
  }
);

export default axiosInstance;
