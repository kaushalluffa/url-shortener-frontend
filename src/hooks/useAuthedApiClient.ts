import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { authedApiClient } from "../api/apiClient";
import { useAuth } from "../context/auth-context";

const useAuthedApiClient = () => {
  const refresh = useRefreshToken();
  const { accessToken } = useAuth();
  useEffect(() => {
    const requestInterceptor = authedApiClient.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    const responseInterceptor = authedApiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return authedApiClient(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      authedApiClient.interceptors.request.eject(requestInterceptor);
      authedApiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refresh]);
  return authedApiClient;
};
export default useAuthedApiClient;
