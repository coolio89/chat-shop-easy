import { useState } from "react";
import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  details: string[];
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
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
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-2">
        <div className="aspect-square overflow-hidden bg-gradient-minimal relative">
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          
          {product.images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
              {product.images.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentImageIndex ? 'bg-foreground' : 'bg-foreground/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className={`absolute inset-0 bg-background/95 backdrop-blur-sm transition-all duration-500 flex flex-col justify-center items-center p-8 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="text-center space-y-4 animate-scale-in max-w-full">
            <h3 className="text-xl font-light tracking-wide">{product.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
            
            <div className="space-y-2">
              {product.details.map((detail, i) => (
                <p key={i} className="text-xs text-muted-foreground/80">• {detail}</p>
              ))}
            </div>
            
            <div className="text-2xl font-light tracking-wider">{product.price.toLocaleString()} XOF</div>
            
            <Button
              onClick={handleWhatsAppClick}
              className="group/btn flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground transition-all duration-500 hover:scale-105 hover:shadow-hover animate-bounce-soft"
            >
              <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-12" />
              <span className="font-light tracking-wide">Commander</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center space-y-2 animate-fade-in">
        <h3 className="text-lg font-light tracking-wide">{product.name}</h3>
        <div className="text-xl font-light tracking-wider text-muted-foreground">{product.price.toLocaleString()} XOF</div>
      </div>
    </div>
  );
};

export default ProductCard;