import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings, ImageIcon, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SettingsTab() {
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [shopData, setShopData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    fetchShopData();
    fetchImages();
  }, []);

  const fetchShopData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: shop, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching shop:', error);
      } else if (shop) {
        setShopData(shop);
        setWhatsappNumber(shop.whatsapp_number || "");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .list('', { limit: 100 });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleWhatsappSave = async () => {
    if (!shopData) {
      toast.error("Vous devez d'abord créer une boutique");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('shops')
        .update({ whatsapp_number: whatsappNumber })
        .eq('id', shopData.id);

      if (error) throw error;

      toast.success("Numéro WhatsApp mis à jour avec succès");
      setWhatsappDialogOpen(false);
      fetchShopData();
    } catch (error) {
      console.error('Error updating WhatsApp:', error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('product-images')
        .remove([fileName]);

      if (error) throw error;

      toast.success("Image supprimée avec succès");
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Erreur lors de la suppression de l'image");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) throw error;
      }

      toast.success(`${files.length} image(s) téléchargée(s) avec succès`);
      fetchImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setLoading(false);
    }
  };

  const clearAllImages = async () => {
    try {
      const fileNames = images.map(img => img.name);
      const { error } = await supabase.storage
        .from('product-images')
        .remove(fileNames);

      if (error) throw error;

      toast.success("Toutes les images ont été supprimées");
      fetchImages();
    } catch (error) {
      console.error('Error clearing images:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-2 border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Paramètres de la Boutique
        </CardTitle>
        <CardDescription>
          Configurez les paramètres généraux de votre boutique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* WhatsApp Configuration */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Configuration WhatsApp</h4>
              <p className="text-sm text-muted-foreground">
                Configurez le numéro WhatsApp pour les commandes
              </p>
              {shopData?.whatsapp_number && (
                <p className="text-xs text-primary mt-1">
                  Actuel: {shopData.whatsapp_number}
                </p>
              )}
            </div>
            <Dialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configuration WhatsApp</DialogTitle>
                  <DialogDescription>
                    Configurez le numéro WhatsApp qui recevra les commandes
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="Ex: +22510203040"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format international recommandé (ex: +22510203040)
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setWhatsappDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleWhatsappSave} disabled={loading}>
                      {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Image Management */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Gestion des Images</h4>
              <p className="text-sm text-muted-foreground">
                Gérez le stockage et l'optimisation des images
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {images.length} image(s) stockée(s)
              </p>
            </div>
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-2 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 transition-all duration-300">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Gérer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Gestion des Images</DialogTitle>
                  <DialogDescription>
                    Téléchargez de nouvelles images ou supprimez celles existantes
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-border rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">Télécharger des images</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Sélectionnez les images à ajouter à votre bibliothèque
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Images Grid */}
                  {images.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Images stockées ({images.length})</h3>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Tout supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer toutes les images</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer toutes les images ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={clearAllImages}>
                                Supprimer tout
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={supabase.storage.from('product-images').getPublicUrl(image.name).data.publicUrl}
                              alt={image.name}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteImage(image.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {image.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}