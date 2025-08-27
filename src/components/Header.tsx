import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-light tracking-wide hover:text-primary transition-colors">
            MomoShop
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {!isDashboard ? (
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/">
              <Button variant="outline" size="sm">
                Retour à la boutique
              </Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;