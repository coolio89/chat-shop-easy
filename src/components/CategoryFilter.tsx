interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="w-full py-12 animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              style={{ animationDelay: `${index * 100}ms` }}
              className={`
                px-8 py-3 text-sm font-light tracking-wide transition-all duration-500 
                animate-fade-in-up hover:scale-105 hover:-translate-y-1
                ${activeCategory === category 
                  ? 'text-foreground border-b-2 border-foreground' 
                  : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-muted-foreground/50'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;