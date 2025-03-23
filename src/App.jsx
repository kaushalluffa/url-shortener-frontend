import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "./components/ui/toaster";
import AppRoutes from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { rtkClient } from "./react-query/client";

function App() {
  return (
    <QueryClientProvider client={rtkClient}>
      <ThemeProvider defaultTheme="system" storageKey="url-shortener-theme">
        <AuthProvider>
          <Router>
            <AppRoutes />
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
