import { useState } from "react";
import { MessageCircle } from "lucide-react";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    const message = `Bonjour! Je suis intéressé(e) par: ${product.name} - ${product.price}€`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className="group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-2">
        <div className="aspect-square overflow-hidden bg-gradient-minimal">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
        </div>
        
        <div className={`absolute inset-0 bg-background/95 backdrop-blur-sm transition-all duration-500 flex flex-col justify-center items-center p-8 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="text-center space-y-4 animate-scale-in">
            <h3 className="text-xl font-light tracking-wide">{product.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
            <div className="text-2xl font-light tracking-wider">{product.price}€</div>
            
            <button
              onClick={handleWhatsAppClick}
              className="group/btn flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground transition-all duration-500 hover:scale-105 hover:shadow-hover animate-bounce-soft"
            >
              <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-12" />
              <span className="font-light tracking-wide">Commander</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center space-y-2 animate-fade-in">
        <h3 className="text-lg font-light tracking-wide">{product.name}</h3>
        <div className="text-xl font-light tracking-wider text-muted-foreground">{product.price}€</div>
      </div>
    </div>
  );
};

export default ProductCard;