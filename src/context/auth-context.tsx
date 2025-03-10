import { useMutation } from "@tanstack/react-query";
import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/mutations/login";
import { registerUser } from "../api/mutations/register";
import { logoutUser } from "../api/mutations/logout";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user"))
  );
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data, "loginUserMutation  ");
    },
  });
  const registerUserMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log(data, "registerUserMutation  ");
    },
  });
  const logoutUserMutation = useMutation({
    mutationFn: logoutUser,
  });
  const login = async (email: string, password: string) => {
    const { user, accessToken } = await loginUserMutation.mutateAsync({
      email,
      password,
    });

    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setAccessToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
  };

  const signup = async (name: string, email: string, password: string) => {
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
