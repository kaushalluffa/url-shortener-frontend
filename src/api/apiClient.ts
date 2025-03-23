import axios from "axios";
import { ENVS } from "../lib/constants";
const accessToken = localStorage.getItem("accessToken");
export const apiClient = axios.create({
  baseURL: `${ENVS.VITE_API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    Authorization: `Bearer ${accessToken}`,
  },
});
export const authedApiClient = axios.create({
  baseURL: `${ENVS.VITE_API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    Authorization: `Bearer ${accessToken}`,
  },
});
