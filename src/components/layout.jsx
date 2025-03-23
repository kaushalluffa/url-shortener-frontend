import { Outlet } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { UrlProvider } from "../context/url-context";
import { Navbar } from "./navbar";


export default function Layout() {
  const { user } = useAuth();

  return (
    <UrlProvider>
      <div className="flex min-h-screen flex-col items-center">
        <Navbar user={user} />
        <main className="container flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </UrlProvider>
  );
}
