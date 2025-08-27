import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from './useProducts';
import { toast } from '@/hooks/use-toast';

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  is_featured?: boolean;
  is_new?: boolean;
  stock_quantity?: number;
  images?: string[];
  details?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  id: string;
  name: string;
  description?: string;
}

export const useProductManagement = () => {
  const [loading, setLoading] = useState(false);

  // Product operations
  const createProduct = async (productData: CreateProductData) => {
    try {
      setLoading(true);
      
      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category_id: productData.category_id,
          is_featured: productData.is_featured || false,
          is_new: productData.is_new || false,
          stock_quantity: productData.stock_quantity || 0
        })
        .select()
        .single();

      if (productError) throw productError;

      // Add images if provided
      if (productData.images && productData.images.length > 0) {
        const imageInserts = productData.images.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          display_order: index,
          alt_text: `${productData.name} - Image ${index + 1}`
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imagesError) throw imagesError;
      }

      // Add details if provided
      if (productData.details && productData.details.length > 0) {
        const detailInserts = productData.details.map((detail, index) => ({
          product_id: product.id,
          detail_text: detail,
          display_order: index
        }));

        const { error: detailsError } = await supabase
          .from('product_details')
          .insert(detailInserts);

        if (detailsError) throw detailsError;
      }

      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès."
      });

      return product;
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Erreur lors de la création: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productData: UpdateProductData) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category_id: productData.category_id,
          is_featured: productData.is_featured,
          is_new: productData.is_new,
          stock_quantity: productData.stock_quantity
        })
        .eq('id', productData.id);

      if (error) throw error;

      toast({
        title: "Produit modifié",
        description: "Le produit a été modifié avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Erreur lors de la modification: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      
      // Delete product images first
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      // Delete product details
      await supabase
        .from('product_details')
        .delete()
        .eq('product_id', productId);

      // Delete product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Category operations
  const createCategory = async (categoryData: CreateCategoryData) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          description: categoryData.description
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Catégorie créée",
        description: "La catégorie a été créée avec succès."
      });

      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Erreur lors de la création: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (categoryData: UpdateCategoryData) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('categories')
        .update({
          name: categoryData.name,
          description: categoryData.description
        })
        .eq('id', categoryData.id);

      if (error) throw error;

      toast({
        title: "Catégorie modifiée",
        description: "La catégorie a été modifiée avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Erreur lors de la modification: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory
  };
};