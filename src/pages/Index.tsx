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
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {activeCategory === "Tous" ? "Tous nos produits" : activeCategory}
          </h2>
          <p className="text-muted-foreground">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun produit trouvé</p>
            <p className="text-muted-foreground">Essayez de modifier votre recherche ou sélectionner une autre catégorie</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
