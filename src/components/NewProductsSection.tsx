import { Product } from "./ProductCard";

interface NewProductsSectionProps {
  products: Product[];
}

const NewProductsSection = ({ products }: NewProductsSectionProps) => {
  // Dupliquer les produits pour un défilement infini
  const duplicatedProducts = [...products, ...products, ...products];

  return (
    <section className="py-16 bg-muted/20 overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-light tracking-wide mb-4">Nouveautés</h2>
          <div className="w-24 h-px bg-primary mx-auto animate-slide-in"></div>
        </div>
      </div>
      
      <div className="relative">
        {/* Gradient fade effects */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
        
        {/* Scrolling container */}
        <div className="flex animate-scroll-infinite hover:pause">
          {duplicatedProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 w-80 mx-4 group cursor-pointer"
            >
              <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl overflow-hidden hover:border-border/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />
                  
                  {/* New badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-light tracking-wide rounded-full animate-pulse">
                    Nouveau
                  </div>
                </div>
                
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-light tracking-wide group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-light text-primary tracking-wide">
                      {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">XOF</span>
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center mt-8 animate-fade-in-up">
        <p className="text-muted-foreground font-light text-sm">
          Découvrez nos derniers arrivages
        </p>
      </div>
    </section>
  );
};

export default NewProductsSection;