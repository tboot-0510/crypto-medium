import axios from "axios";

const axiosOptions = {
  baseURL: "http://localhost:5000/",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
  withCredentials: false,
};

const axiosInstance = axios.create(axiosOptions);

axiosInstance.interceptors.request.use((config) => ({
  ...config,
  headers: {
    ...config.headers,
  },
}));

export default axiosInstance;
