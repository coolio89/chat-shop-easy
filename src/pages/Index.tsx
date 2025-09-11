import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SearchHeader from "@/components/SearchHeader";
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 transition-colors duration-300">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-20">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-border/30">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50"></div>
          <div className="container mx-auto px-6 py-20 relative">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
                Découvrez notre Collection MomoShop
              </h1>
              <p className="text-xl text-muted-foreground font-light mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Une boutique moderne avec une sélection soignée de produits de qualité pour tous vos besoins. Explorez nos catégories et trouvez exactement ce que vous cherchez.
              </p>
              <div className="flex items-center justify-center gap-4 animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-light text-primary">{products.length} produits disponibles</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce-soft"></div>
                  <span className="text-sm font-light text-accent">{dbCategories.length} catégories</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Search & Categories */}
        <div className="sticky top-20 z-40 w-full bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-md border-b border-border/30 shadow-card animate-fade-in">
          <SearchHeader 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
        
        {/* Section Nouveautés */}
        {newProducts.length > 0 && <NewProductsSection products={newProducts} />}
        
        <main className="container mx-auto px-6 py-16">
          <div className="mb-16 text-center animate-fade-in">
            <h2 className="text-3xl font-light tracking-wide mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {activeCategory === "Tous" ? "Notre Collection" : activeCategory}
            </h2>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6 animate-slide-in"></div>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-card/50 to-muted/30 border border-border/50 rounded-full backdrop-blur-sm animate-scale-in shadow-card">
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse-soft"></div>
              <p className="text-muted-foreground font-light">
                {filteredProducts.length} {filteredProducts.length > 1 ? 'produits disponibles' : 'produit disponible'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-32 animate-fade-in">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full"></div>
                </div>
                <h3 className="text-2xl font-light tracking-wide mb-4 text-muted-foreground">Aucun résultat trouvé</h3>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-muted-foreground to-transparent mx-auto mb-4"></div>
                <p className="text-muted-foreground font-light">Essayez d'ajuster vos critères de recherche</p>
              </div>
            </div>
          )}
        </main>
        
        {/* Footer Section MomoShop */}
        <footer className="bg-gradient-to-r from-muted/50 to-background border-t border-border/30 mt-20">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-light tracking-wide mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MomoShop - Votre Boutique de Confiance
              </h3>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">
                Chez MomoShop, nous nous engageons à vous offrir une expérience d'achat exceptionnelle avec des produits de qualité, un service client attentionné et une livraison rapide.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>
                <h4 className="font-medium mb-2 text-foreground">Qualité Garantie</h4>
                <p className="text-sm text-muted-foreground">Sélection rigoureuse de produits de haute qualité</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                </div>
                <h4 className="font-medium mb-2 text-foreground">Service Client</h4>
                <p className="text-sm text-muted-foreground">Équipe dédiée pour vous accompagner</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>
                <h4 className="font-medium mb-2 text-foreground">Livraison Rapide</h4>
                <p className="text-sm text-muted-foreground">Expédition sous 24h partout au pays</p>
              </div>
            </div>
            
            <div className="text-center border-t border-border/30 pt-8">
              <p className="text-sm text-muted-foreground">
                © 2025 MomoShop. Tous droits réservés. Découvrez notre collection et faites-vous plaisir avec nos produits exceptionnels.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
