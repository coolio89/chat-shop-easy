import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { user, signOut, profile } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" to="/">
            <span className="hidden font-bold sm:inline-block">
              MomoShop
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {user && (
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                to={profile?.role === 'admin' ? '/dashboard' : '/user-dashboard'}
              >
                {profile?.role === 'admin' ? 'Dashboard Admin' : 'Mon Espace'}
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm">
                  <User className="h-4 w-4" />
                  <span>{profile?.full_name || user.email}</span>
                  {profile?.role === 'admin' && (
                    <span className="text-xs bg-primary text-primary-foreground px-1 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}