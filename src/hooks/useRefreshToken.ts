import { apiClient } from "../api/apiClient";
import { useAuth } from "../context/auth-context";

const useRefreshToken = () => {
  const { setAccessToken } = useAuth();
  const refresh = async () => {
    const response = await apiClient.get("/refresh", {
      withCredentials: true,
    });
    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  };
  return refresh;
};
export default useRefreshToken;
