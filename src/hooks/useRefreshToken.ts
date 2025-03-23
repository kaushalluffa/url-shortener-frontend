import { apiClient } from "../api/apiClient";
import { useAuth } from "../context/auth-context";

const useRefreshToken = () => {
  const { setAccessToken } = useAuth();
  const refresh = async () => {
    const response = await apiClient.get("/auth/refresh", {
      withCredentials: true,
    });
    localStorage.setItem("accessToken", response.data.accessToken);
    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  };
  return refresh;
};
export default useRefreshToken;
