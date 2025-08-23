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
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-transparent">
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
                      onClick={() => onCategoryChange(category)}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className={`
                        w-full text-left px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 
                        animate-fade-in-up hover:translate-x-2
                        ${activeCategory === category 
                          ? 'text-foreground bg-muted/50' 
                          : 'text-muted-foreground hover:text-foreground'
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
    </header>
  );
};

export default Header;