import { apiClient } from "../apiClient";

export const loginUser = async (body) => {
  const response = await apiClient.post("/auth/login", body);
  return response.data;
};
