import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
    }
  }, [products, id]);

  const handleWhatsAppClick = () => {
    if (product) {
      // Use shop's WhatsApp number if available, otherwise use default
      const whatsappNumber = product.shop?.whatsapp_number || '22967676767';
      const message = `Bonjour! Je suis intéressé(e) par: ${product.name} - ${product.price.toLocaleString()} XOF`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
            <Button onClick={() => navigate('/')} variant="outline" className="border-2">
              <ArrowLeft className="h-4 w-4 mr-2 border rounded-full p-0.5" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="mb-4 border-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2 border rounded-full p-0.5" />
              Retour aux produits
            </Button>
            <nav className="text-sm text-muted-foreground">
              <span>Accueil</span> / <span>{product.category}</span> / <span className="text-foreground">{product.name}</span>
              {product.shop?.name && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 border-2 border-muted rounded-full text-xs">
                  <span className="text-muted-foreground">Boutique:</span>
                  <span className="text-foreground font-medium">{product.shop.name}</span>
                </div>
              )}
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-2xl relative group">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {product.images.length > 1 && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevImage}
                        className="bg-background/90 backdrop-blur-md hover:bg-background h-10 w-10 p-0 rounded-full border-2"
                      >
                        <ChevronLeft className="h-5 w-5 border rounded-full p-0.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextImage}
                        className="bg-background/90 backdrop-blur-md hover:bg-background h-10 w-10 p-0 rounded-full border-2"
                      >
                        <ChevronRight className="h-5 w-5 border rounded-full p-0.5" />
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full">
                      {product.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i === currentImageIndex 
                              ? 'bg-primary scale-125' 
                              : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'border-primary scale-105' 
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.is_new && <Badge variant="outline">Nouveau</Badge>}
                  {product.is_featured && <Badge variant="outline">Vedette</Badge>}
                </div>
                <h1 className="text-3xl font-light mb-4">{product.name}</h1>
                <div className="text-4xl font-light text-primary mb-6">
                  {product.price.toLocaleString()} <span className="text-2xl text-muted-foreground">XOF</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                {product.details.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Caractéristiques</h3>
                    <ul className="space-y-2">
                      {product.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Stock disponible</p>
                  <p className="font-medium">{product.stock_quantity} unités</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-6">
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center gap-3 py-6 bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 border-2 border-green-600"
                >
                  <MessageCircle className="h-5 w-5 border rounded-full p-0.5 border-white" />
                  Commander via WhatsApp
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="py-3 border-2">
                    <ShoppingCart className="h-4 w-4 mr-2 border rounded-full p-0.5" />
                    Ajouter au panier
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/')} className="border-2">
                    Continuer mes achats
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;