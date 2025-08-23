import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ProductCard, { Product } from "@/components/ProductCard";
import smartphoneImg from "@/assets/smartphone.jpg";
import smartphoneBackImg from "@/assets/smartphone-back.jpg";
import headphonesImg from "@/assets/headphones.jpg";
import headphonesSideImg from "@/assets/headphones-side.jpg";
import laptopImg from "@/assets/laptop.jpg";
import laptopClosedImg from "@/assets/laptop-closed.jpg";
import tshirtImg from "@/assets/tshirt.jpg";
import tshirtHangingImg from "@/assets/tshirt-hanging.jpg";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 750000,
    images: [smartphoneImg, smartphoneBackImg],
    category: "Électronique",
    description: "Le smartphone le plus avancé avec puce A17 Pro et caméra 48MP",
    details: ["Écran 6.7 pouces Super Retina XDR", "Puce A17 Pro", "Caméra 48MP", "Batterie longue durée", "5G ultra-rapide"]
  },
  {
    id: 2,
    name: "AirPods Pro (2ème gen)",
    price: 175000,
    images: [headphonesImg, headphonesSideImg],
    category: "Électronique",
    description: "Écouteurs sans fil avec réduction de bruit active",
    details: ["Réduction de bruit active", "Audio spatial", "Résistance à l'eau IPX4", "Jusqu'à 30h d'écoute", "Compatible Siri"]
  },
  {
    id: 3,
    name: "MacBook Air M2",
    price: 815000,
    images: [laptopImg, laptopClosedImg],
    category: "Électronique",
    description: "Ordinateur portable ultra-fin avec puce M2 et écran Liquid Retina",
    details: ["Puce M2 8 cœurs", "Écran Liquid Retina 13.6 pouces", "18h d'autonomie", "Ultra-fin 11.3mm", "Caméra FaceTime HD 1080p"]
  },
  {
    id: 4,
    name: "T-shirt Premium Coton",
    price: 18000,
    images: [tshirtImg, tshirtHangingImg],
    category: "Mode",
    description: "T-shirt en coton bio premium, coupe moderne et confortable",
    details: ["100% coton bio", "Coupe moderne", "Résistant au lavage", "Tailles S à XXL", "Certifié OEKO-TEX"]
  },
  {
    id: 5,
    name: "Casque Gaming Pro",
    price: 99000,
    images: [headphonesImg, headphonesSideImg],
    category: "Gaming",
    description: "Casque gaming avec micro détachable et son surround 7.1",
    details: ["Son surround 7.1", "Micro antibruit détachable", "Coussinets en mousse mémoire", "Compatible PC/Console", "Éclairage RGB"]
  },
  {
    id: 6,
    name: "Smartphone Android Flagship",
    price: 565000,
    images: [smartphoneImg, smartphoneBackImg],
    category: "Électronique",
    description: "Smartphone Android haut de gamme avec écran 120Hz et triple caméra",
    details: ["Écran AMOLED 120Hz", "Triple caméra 108MP", "Charge rapide 65W", "8GB RAM + 256GB", "Android 14"]
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");

  const categories = ["Tous", ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "Tous" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <main className="container mx-auto px-6 py-16">
        <div className="mb-16 text-center animate-fade-in">
          <h2 className="text-2xl font-light tracking-wide mb-4">
            {activeCategory === "Tous" ? "Collection" : activeCategory}
          </h2>
          <div className="w-24 h-px bg-muted-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground font-light">
            {filteredProducts.length} {filteredProducts.length > 1 ? 'produits' : 'produit'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 animate-fade-in">
            <p className="text-muted-foreground text-xl font-light mb-4">Aucun résultat</p>
            <div className="w-16 h-px bg-muted-foreground mx-auto mb-4"></div>
            <p className="text-muted-foreground font-light">Modifiez votre recherche</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
