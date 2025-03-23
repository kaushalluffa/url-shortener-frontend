import { apiClient } from "../apiClient";

export const registerUser = async (body) => {
  const response = await apiClient.post("/auth/register", body);
  return response.data;
};
