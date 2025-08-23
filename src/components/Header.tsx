import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center animate-scale-in">
            <h1 className="text-4xl font-light tracking-wide text-foreground mb-2 hover:tracking-wider transition-all duration-500">
              Shop
            </h1>
            <div className="w-12 h-px bg-foreground mx-auto animate-slide-in"></div>
          </div>
          
          <div className="w-full max-w-lg animate-fade-in-up">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-all duration-300 group-hover:text-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 py-6 text-lg border-0 bg-transparent border-b-2 border-border focus:border-foreground rounded-none transition-all duration-500 focus:shadow-none placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;