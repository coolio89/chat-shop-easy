import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleWhatsAppClick = () => {
    const message = `Bonjour! Je suis intéressé(e) par: ${product.name} - ${product.price.toLocaleString()} XOF`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div 
      className="group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 120}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 rounded-2xl blur-xl transition-all duration-700 ${
        isHovered ? 'opacity-60 scale-110' : 'opacity-0 scale-100'
      }`} />
      
      <div className="relative overflow-hidden transition-all duration-700 hover:scale-[1.03] hover:-translate-y-3 bg-background/50 backdrop-blur-sm border border-border/30 hover:border-border/60 rounded-2xl hover:shadow-2xl hover:shadow-primary/10">
        <div className="aspect-square overflow-hidden relative">
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          
          
          {/* Enhanced image navigation */}
          {product.images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="bg-background/90 backdrop-blur-md hover:bg-background h-8 w-8 p-0 rounded-full border border-border/50 hover:scale-110 transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="bg-background/90 backdrop-blur-md hover:bg-background h-8 w-8 p-0 rounded-full border border-border/50 hover:scale-110 transition-all duration-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Enhanced image indicators */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {product.images.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    i === currentImageIndex 
                      ? 'bg-primary scale-125 shadow-sm' 
                      : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Refined overlay with smooth transitions */}
        <div className={`absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-sm transition-all duration-700 flex flex-col justify-center items-center p-8 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="text-center space-y-6 animate-scale-in max-w-full">
            <div className="space-y-3">
              <h3 className="text-xl font-light tracking-wide text-foreground">{product.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{product.description}</p>
            </div>
            
            {/* Animated details list */}
            <div className="space-y-2 max-h-24 overflow-hidden">
              {product.details.slice(0, 3).map((detail, i) => (
                <p 
                  key={i} 
                  className="text-xs text-muted-foreground/90 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  • {detail}
                </p>
              ))}
            </div>
            
            {/* Price with subtle animation */}
            <div className="text-2xl font-light tracking-wider text-primary group-hover:scale-105 transition-transform duration-300">
              {product.price.toLocaleString()} <span className="text-lg text-muted-foreground">XOF</span>
            </div>
            
            {/* Enhanced WhatsApp button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleWhatsAppClick();
              }}
              className="group/btn flex items-center gap-3 px-8 py-3 bg-green-500 hover:bg-green-600 text-white transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 rounded-full border border-green-400/20"
            >
              <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-12" />
              <span className="font-light tracking-wide">Commander via WhatsApp</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Static info below card */}
      <div className="mt-6 text-center space-y-2 animate-fade-in">
        <h3 className="text-lg font-light tracking-wide group-hover:text-primary transition-colors duration-300">{product.name}</h3>
        <div className="flex items-center justify-center gap-2">
          <div className="text-xl font-light tracking-wider text-primary">{product.price.toLocaleString()}</div>
          <span className="text-sm text-muted-foreground">XOF</span>
          <div className={`w-1 h-1 bg-primary rounded-full transition-all duration-500 ${
            isHovered ? 'animate-pulse scale-150' : ''
          }`} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;