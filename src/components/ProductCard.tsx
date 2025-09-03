import { MessageCircle } from "lucide-react";

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
  const handleWhatsAppClick = () => {
    // Use shop's WhatsApp number if available, otherwise use default
    const whatsappNumber = product.shop?.whatsapp_number || '22967676767';
    const message = encodeURIComponent(
      `Salut! Je suis intéressé par le produit "${product.name}" au prix de ${product.price.toLocaleString()} XOF. Pouvez-vous me donner plus d'informations?`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className="group cursor-pointer animate-fade-in hover-scale"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={handleWhatsAppClick}
    >
      <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl overflow-hidden hover:border-border/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
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

          {/* WhatsApp Overlay - Show on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
            <div className="text-center text-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-primary" />
              <p className="text-sm font-light tracking-wide">Cliquez pour commander</p>
              <p className="text-xs text-muted-foreground mt-1">via WhatsApp</p>
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