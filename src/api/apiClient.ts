import axios from "axios";
import { authStore } from "../stores/authStore";



const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface ApiErrorShape {

  status?: number;
  code?: string;
  message?: string;
  details?: any;
  raw?: any;
}

export const apiClient = axios.create({
  baseURL,
  timeout: 5000, // 5 seconds timeout
    headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});
