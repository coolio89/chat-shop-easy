import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import NewProductsSection from "@/components/NewProductsSection";
import { useProducts } from "@/hooks/useProducts";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const { products, categories: dbCategories, loading, error, getNewProducts } = useProducts();

  const categories = ["Tous", ...dbCategories.map(cat => cat.name)];
  
  // Products récents pour la section nouveautés
  const newProducts = getNewProducts();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "Tous" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-light">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Erreur : {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      {/* Section Nouveautés */}
      {newProducts.length > 0 && <NewProductsSection products={newProducts} />}
      
      <main className="container mx-auto px-6 py-16">
        <div className="mb-16 text-center animate-fade-in">
          <h2 className="text-2xl font-light tracking-wide mb-4 transition-all duration-300">
            {activeCategory === "Tous" ? "Collection" : activeCategory}
          </h2>
          <div className="w-24 h-px bg-muted-foreground mx-auto mb-4 animate-slide-in"></div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/20 rounded-full backdrop-blur-sm animate-scale-in">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            <p className="text-muted-foreground font-light text-sm">
              {filteredProducts.length} {filteredProducts.length > 1 ? 'produits' : 'produit'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
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
