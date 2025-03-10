import type React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/auth-context";
import { UrlProvider } from "./context/url-context";
import CreateLinkPage from "./pages/create-link";
import DashboardPage from "./pages/dashboard";
import LoginPage from "./pages/login";
import RedirectPage from "./pages/redirect";
import SettingsPage from "./pages/settings";
import SignupPage from "./pages/signup";

import AppSidebar from "./components/AppSidebar";
import Layout from "./components/layout";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/:shortCode"
        element={
          <UrlProvider>
            <RedirectPage />
          </UrlProvider>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="create" element={<CreateLinkPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
