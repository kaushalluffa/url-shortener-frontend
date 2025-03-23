import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  Link2,
  Menu,
  Plus,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/auth-context";
import { ModeToggle } from "./mode-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

type NavbarProps = {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export function Navbar({ user }: NavbarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    { name: "Create URL", path: "/create", icon: <Plus className="h-4 w-4" /> },
    // {
    //   name: "Settings",
    //   path: "/settings",
    //   icon: <Settings className="h-4 w-4" />,
    // },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Link2 className="h-6 w-6" />
            <span className="hidden font-bold md:inline-block">
              URL Shortener
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.path) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link to="/login">Login</Link>
            </Button>
          )}

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[385px] pr-0">
              <div className="flex flex-col gap-6 px-2 py-4">
                <Link
                  to="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Link2 className="h-6 w-6" />
                  <span className="font-bold">URL Shortener</span>
                </Link>
                <nav className="flex flex-col gap-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                        isActive(item.path) ? "bg-accent" : ""
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </nav>
                {user && (
                  <div className="mt-auto border-t pt-4">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start mt-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
