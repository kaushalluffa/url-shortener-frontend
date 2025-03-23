import { apiClient } from "../apiClient";

export default async function redirectToUrl(shortCode) {
  return await apiClient.get(`/shorten/redirect/${shortCode}`);
}
