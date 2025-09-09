import React, { useState } from "react";
import CategoryManager from "@/components/CategoryManager";
import ShopManager from "@/components/ShopManager";
import SettingsTab from "@/components/SettingsTab";
import { useQuery } from "@tanstack/react-query";
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
import ProtectedRoute from "@/components/ProtectedRoute";
import { Plus, Package, Grid3X3, Edit, Trash2, Settings, ImageIcon } from "lucide-react";

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
        <div className="border-b border-border/50 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm mb-8 shadow-card">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-light tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-1">Gestion de votre boutique</p>
              </div>
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent border-0 shadow-elegant hover:shadow-hover transition-all duration-300 hover:scale-105"
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
            <Card className="bg-gradient-to-br from-card to-card/80 border-2 border-border/50 shadow-card hover:shadow-hover transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Package className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{totalProducts}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/80 border-2 border-border/50 shadow-card hover:shadow-hover transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveautés</CardTitle>
                <Badge variant="outline" className="text-xs border-accent/30 text-accent bg-accent/10">Nouveau</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{newProducts}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/80 border-2 border-border/50 shadow-card hover:shadow-hover transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produits Vedettes</CardTitle>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10">★</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{featuredProducts}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/80 border-2 border-border/50 shadow-card hover:shadow-hover transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                  <Grid3X3 className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{totalStock}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="shop" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50 shadow-card">
              <TabsTrigger 
                value="shop"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant transition-all duration-300"
              >
                Boutique
              </TabsTrigger>
              <TabsTrigger 
                value="products"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant transition-all duration-300"
              >
                Produits
              </TabsTrigger>
              <TabsTrigger 
                value="categories"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant transition-all duration-300"
              >
                Catégories
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant transition-all duration-300"
              >
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card className="bg-gradient-to-br from-card to-card/80 border-2 border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Gestion des Produits</CardTitle>
                  <CardDescription>
                    Gérez vos produits, leurs images et détails
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border-2 border-border/50 rounded-lg bg-gradient-to-r from-card/50 to-muted/20 hover:shadow-card transition-all duration-300 hover:scale-[1.02]">
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
                            className="border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-300">
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

            <TabsContent value="shop">
              <ShopManager />
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManager />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab />
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