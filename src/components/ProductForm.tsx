import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { useProductManagement, CreateProductData, UpdateProductData } from "@/hooks/useProductManagement";
import { Product } from "@/hooks/useProducts";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ProductFormProps {
  categories: Category[];
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm = ({ categories, product, onSuccess, onCancel }: ProductFormProps) => {
  const { createProduct, updateProduct, loading } = useProductManagement();
  
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    category_id: categories.find(cat => cat.name === product?.category)?.id || "",
    is_featured: product?.is_featured || false,
    is_new: product?.is_new || false,
    stock_quantity: product?.stock_quantity?.toString() || "0",
    images: product?.images || [""],
    details: product?.details || [""]
  });

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, ""]
    }));
  };

  const removeDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  const updateDetail = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.map((detail, i) => i === index ? value : detail)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category_id: formData.category_id,
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        stock_quantity: parseInt(formData.stock_quantity),
        images: formData.images.filter(img => img.trim() !== ""),
        details: formData.details.filter(detail => detail.trim() !== "")
      };

      if (product) {
        await updateProduct({ id: product.id, ...productData } as UpdateProductData);
      } else {
        await createProduct(productData as CreateProductData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Modifier' : 'Ajouter'} un produit</CardTitle>
        <CardDescription>
          {product ? 'Modifiez les informations du produit' : 'Créez un nouveau produit pour votre boutique'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prix (XOF) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
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
          </div>

          <Separator />

          {/* Product Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Statut du produit</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="is_featured">Produit vedette</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_new"
                checked={formData.is_new}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_new: checked }))}
              />
              <Label htmlFor="is_new">Nouveau produit</Label>
            </div>
          </div>

          <Separator />

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Images</h3>
              <Button type="button" variant="outline" size="sm" onClick={addImage}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une image
              </Button>
            </div>
            
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="URL de l'image"
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Détails</h3>
              <Button type="button" variant="outline" size="sm" onClick={addDetail}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un détail
              </Button>
            </div>
            
            {formData.details.map((detail, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Détail du produit"
                  value={detail}
                  onChange={(e) => updateDetail(index, e.target.value)}
                />
                {formData.details.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDetail(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : (product ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;