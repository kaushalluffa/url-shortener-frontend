import { apiClient } from "../apiClient";

export const loginUser = async (body: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', body)
    return response.data
}