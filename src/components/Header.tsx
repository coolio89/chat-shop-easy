import { useState } from "react";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const Header = ({ searchQuery, onSearchChange, categories, activeCategory, onCategoryChange }: HeaderProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setIsSheetOpen(false); // Ferme automatiquement le panneau
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-transparent transition-all duration-300 hover:scale-110">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background/95 backdrop-blur-md">
              <div className="py-8">
                <h3 className="text-lg font-light tracking-wide mb-8">Catégories</h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className={`
                        w-full text-left px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 
                        animate-fade-in-up hover:translate-x-2 rounded-lg
                        ${activeCategory === category 
                          ? 'text-foreground bg-muted/50 scale-105' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                        }
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="text-center animate-scale-in">
            <h1 className="text-4xl font-light tracking-wide text-foreground hover:tracking-wider transition-all duration-500">
              MomoShop
            </h1>
            <div className="w-12 h-px bg-foreground mx-auto animate-slide-in mt-2"></div>
          </div>

          <div className="w-6"></div>
        </div>
        
        <div className="w-full max-w-lg mx-auto animate-fade-in-up">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-focus-within:text-foreground group-focus-within:scale-110" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-14 pr-5 py-6 text-lg bg-muted/30 hover:bg-muted/50 focus:bg-muted/60 border-0 rounded-full transition-all duration-500 focus:shadow-lg focus:shadow-primary/10 placeholder:text-muted-foreground/60 backdrop-blur-sm"
            />
            {searchQuery && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-fade-in">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;