import { useNavigate } from "react-router-dom";

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  details: string[];
  is_featured: boolean;
  is_new: boolean;
  stock_quantity: number;
  shop?: {
    id: string;
    name: string;
    whatsapp_number?: string;
  };
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="group cursor-pointer animate-fade-in hover-scale"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={handleProductClick}
    >
      <div className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-2 border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-elegant group-hover:scale-[1.02]">
        {/* Image Container */}
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          
          {/* New/Featured Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.is_new && (
              <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-light tracking-wide rounded-full animate-pulse">
                Nouveau
              </div>
            )}
            {product.is_featured && (
              <div className="px-3 py-1 bg-accent text-accent-foreground text-xs font-light tracking-wide rounded-full">
                Vedette
              </div>
            )}
          </div>

          {/* Shop name if available */}
          {product.shop?.name && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-background/80 backdrop-blur-sm text-xs font-light tracking-wide rounded-full">
              {product.shop.name}
            </div>
          )}

          {/* Details Overlay - Show on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
            <div className="text-center text-foreground">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center border-2 border-primary/30">
              </div>
              <p className="text-sm font-light tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Voir les détails</p>
              <p className="text-xs text-muted-foreground mt-1">Cliquez pour plus d'infos</p>
            </div>
          </div>
        </div>

        {/* Product Info - Always Visible */}
        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-light tracking-wide group-hover:text-primary transition-colors duration-300 line-clamp-1 flex-1">
              {product.name}
            </h3>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-xl font-light text-primary tracking-wide">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">XOF</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground font-light line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-light bg-muted/40 px-3 py-1 rounded-full">
              {product.category}
            </span>
            {product.stock_quantity > 0 ? (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground font-light">En stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-xs text-muted-foreground font-light">Épuisé</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;