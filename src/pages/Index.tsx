import { useState, useMemo } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard, { Product } from "@/components/ProductCard";
import smartphoneImg from "@/assets/smartphone.jpg";
import headphonesImg from "@/assets/headphones.jpg";
import laptopImg from "@/assets/laptop.jpg";
import tshirtImg from "@/assets/tshirt.jpg";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1199,
    image: smartphoneImg,
    category: "Électronique",
    description: "Le smartphone le plus avancé avec puce A17 Pro et caméra 48MP"
  },
  {
    id: 2,
    name: "AirPods Pro (2ème gen)",
    price: 279,
    image: headphonesImg,
    category: "Électronique",
    description: "Écouteurs sans fil avec réduction de bruit active"
  },
  {
    id: 3,
    name: "MacBook Air M2",
    price: 1299,
    image: laptopImg,
    category: "Électronique",
    description: "Ordinateur portable ultra-fin avec puce M2 et écran Liquid Retina"
  },
  {
    id: 4,
    name: "T-shirt Premium Coton",
    price: 29,
    image: tshirtImg,
    category: "Mode",
    description: "T-shirt en coton bio premium, coupe moderne et confortable"
  },
  {
    id: 5,
    name: "Casque Gaming Pro",
    price: 159,
    image: headphonesImg,
    category: "Gaming",
    description: "Casque gaming avec micro détachable et son surround 7.1"
  },
  {
    id: 6,
    name: "Smartphone Android Flagship",
    price: 899,
    image: smartphoneImg,
    category: "Électronique",
    description: "Smartphone Android haut de gamme avec écran 120Hz et triple caméra"
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
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryFilter 
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
