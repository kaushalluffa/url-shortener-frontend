import { authedApiClient } from "../apiClient";

export const logoutUser = async () => {
  await authedApiClient.get("/logout");
};
