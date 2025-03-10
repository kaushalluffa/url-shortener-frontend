import { apiClient } from "../apiClient";
export type RegisterUserBody = {
  email: string;
  password: string;
  name: string;
};
export const registerUser = async (body: RegisterUserBody) => {
  const response = await apiClient.post("/auth/register", body);
  return response.data;
};
