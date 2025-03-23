import { useMutation } from "@tanstack/react-query";

import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/mutations/login";
import { registerUser } from "../api/mutations/register";
import { logoutUser } from "../api/mutations/logout";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
  });
  const registerUserMutation = useMutation({
    mutationFn: registerUser,
  });
  const logoutUserMutation = useMutation({
    mutationFn: logoutUser,
  });
  const login = async (email, password) => {
    const { user, accessToken } = await loginUserMutation.mutateAsync({
      email,
      password,
    });

    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setAccessToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
  };

  const signup = async (name, email, password) => {
    const { user, accessToken } = await registerUserMutation.mutateAsync({
      name,
      email,
      password,
    });
    setUser(user);
    setAccessToken(accessToken);
  };

  const logout = async () => {
    await logoutUserMutation.mutateAsync();
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading:
          loginUserMutation.isPending || registerUserMutation.isPending,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
