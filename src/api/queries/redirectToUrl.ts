import { apiClient } from "../apiClient";

export default async function redirectToUrl(shortCode: string) {
  return await apiClient.get(`/shorten/redirect/${shortCode}`);
}
