import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 60000,
  // Do NOT set a global Content-Type here.
  // For multipart/form-data (file uploads), axios sets it automatically
  // with the correct boundary. Overriding it here would break uploads.
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
