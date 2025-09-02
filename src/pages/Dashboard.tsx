import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Package, Grid3X3, Image, Settings, Edit } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductForm from "@/components/ProductForm";
import { useProductManagement } from "@/hooks/useProductManagement";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CategoryManager from "@/components/CategoryManager";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  is_featured: boolean;
  is_new: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  images: string[];
  details: string[];
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

function DashboardContent() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const { deleteProduct, deleteCategory, loading: managementLoading } = useProductManagement();

  const { data: products = [], refetch: refetchProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      const productsWithDetails = await Promise.all(
        productsData.map(async (product) => {
          const { data: imagesData } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('product_id', product.id)
            .order('display_order');

          const { data: detailsData } = await supabase
            .from('product_details')
            .select('detail_text')
            .eq('product_id', product.id)
            .order('display_order');

          return {
            ...product,
            images: imagesData?.map(img => img.image_url) || [],
            details: detailsData?.map(detail => detail.detail_text) || []
          };
        })
      );

      return productsWithDetails as Product[];
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Category[];
    }
  });

  const handleProductSuccess = () => {
    setShowProductForm(false);
    setSelectedProduct(null);
    refetchProducts();
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success("Produit supprimé avec succès");
      refetchProducts();
    } catch (error) {
      toast.error("Erreur lors de la suppression du produit");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      toast.success("Catégorie supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la catégorie");
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const totalProducts = products.length;
  const newProducts = products.filter(p => p.is_new).length;
  const featuredProducts = products.filter(p => p.is_featured).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock_quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        {/* Dashboard Header */}
        <div className="border-b bg-card/50 backdrop-blur-sm mb-8">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-light tracking-wide">Dashboard</h1>
                <p className="text-muted-foreground text-sm">Gestion de votre boutique</p>
              </div>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setShowProductForm(true)}
              >
                <Plus className="h-4 w-4" />
                Nouveau produit
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveautés</CardTitle>
                <Badge variant="secondary" className="text-xs">Nouveau</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{newProducts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produits Vedettes</CardTitle>
                <Badge variant="default" className="text-xs">★</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{featuredProducts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
                <Grid3X3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStock}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="categories">Catégories</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Produits</CardTitle>
                  <CardDescription>
                    Gérez vos produits, leurs images et détails
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          {product.images.length > 0 && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {product.price.toLocaleString()} XOF
                            </p>
                            <div className="flex gap-2 mt-2">
                              {product.is_new && (
                                <Badge variant="secondary" className="text-xs">Nouveau</Badge>
                              )}
                              {product.is_featured && (
                                <Badge variant="default" className="text-xs">Vedette</Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {product.images.length} images
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer "{product.name}" ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManager />
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de la Boutique</CardTitle>
                  <CardDescription>
                    Configurez les paramètres généraux de votre boutique
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Configuration WhatsApp</h4>
                        <p className="text-sm text-muted-foreground">
                          Configurez le numéro WhatsApp pour les commandes
                        </p>
                      </div>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurer
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Gestion des Images</h4>
                        <p className="text-sm text-muted-foreground">
                          Gérez le stockage et l'optimisation des images
                        </p>
                      </div>
                      <Button variant="outline">
                        <Image className="h-4 w-4 mr-2" />
                        Gérer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ProductForm
            categories={categories}
            product={selectedProduct}
            onSuccess={handleProductSuccess}
            onCancel={() => {
              setShowProductForm(false);
              setSelectedProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <DashboardContent />
    </ProtectedRoute>
  );
}