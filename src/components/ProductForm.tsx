import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, X } from "lucide-react";
import { useProductManagement } from "@/hooks/useProductManagement";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  is_featured: boolean;
  is_new: boolean;
  stock_quantity: number;
  images: string[];
  details: string[];
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface ProductFormProps {
  categories: Category[];
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ categories, product, onSuccess, onCancel }: ProductFormProps) {
  const { createProduct, updateProduct, loading } = useProductManagement();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category_id: product?.category_id || "",
    is_featured: product?.is_featured || false,
    is_new: product?.is_new || false,
    stock_quantity: product?.stock_quantity || 0,
  });
  const [details, setDetails] = useState<string[]>(product?.details || [""]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDetailChange = (index: number, value: string) => {
    const newDetails = [...details];
    newDetails[index] = value;
    setDetails(newDetails);
  };

  const addDetail = () => {
    setDetails([...details, ""]);
  };

  const removeDetail = (index: number) => {
    if (details.length > 1) {
      setDetails(details.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const removeImageFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];
    
    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error("Erreur lors du téléchargement des images");
      throw error;
    } finally {
      setUploading(false);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category_id) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      // Upload new images
      const newImageUrls = await uploadImages();
      
      // Combine existing and new images
      const allImages = [...existingImages, ...newImageUrls];
      
      // Filter out empty details
      const filteredDetails = details.filter(detail => detail.trim() !== "");

      const productData = {
        ...formData,
        images: allImages,
        details: filteredDetails
      };

      if (product) {
        await updateProduct({
          id: product.id,
          ...productData
        });
        toast.success("Produit mis à jour avec succès");
      } else {
        await createProduct(productData);
        toast.success("Produit créé avec succès");
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error("Erreur lors de la sauvegarde du produit");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {product ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          <p className="text-muted-foreground">
            {product ? "Modifiez les informations du produit" : "Ajoutez un nouveau produit à votre catalogue"}
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
            <CardDescription>
              Détails principaux du produit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleInputChange("category_id", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prix (XOF)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange("stock_quantity", parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                />
                <Label htmlFor="featured">Produit vedette</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="new"
                  checked={formData.is_new}
                  onCheckedChange={(checked) => handleInputChange("is_new", checked)}
                />
                <Label htmlFor="new">Nouveau produit</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>
              Téléchargez des images de votre produit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="images">Ajouter des images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Formats acceptés: JPG, PNG, WebP. Taille max: 5MB par image.
              </p>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <Label>Images actuelles</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {existingImages.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeExistingImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Files */}
            {imageFiles.length > 0 && (
              <div>
                <Label>Nouvelles images</Label>
                <div className="space-y-2 mt-2">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImageFile(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Détails du produit</CardTitle>
          <CardDescription>
            Ajoutez des détails spécifiques sur votre produit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {details.map((detail, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={detail}
                  onChange={(e) => handleDetailChange(index, e.target.value)}
                  placeholder={`Détail ${index + 1}`}
                />
                {details.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDetail(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addDetail}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un détail
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={loading || uploading}
          className="min-w-[120px]"
        >
          {loading || uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {uploading ? "Upload..." : "Sauvegarde..."}
            </>
          ) : (
            product ? "Mettre à jour" : "Créer le produit"
          )}
        </Button>
      </div>
    </form>
  );
}
