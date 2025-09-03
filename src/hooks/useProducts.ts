import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  details: string[];
  is_featured: boolean;
  is_new: boolean;
  stock_quantity: number;
  shop?: {
    id: string;
    name: string;
    whatsapp_number?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products with their categories, images, details, and shop info
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          is_featured,
          is_new,
          stock_quantity,
          categories(name),
          product_images(image_url, alt_text, display_order),
          product_details(detail_text, display_order),
          shops(id, name, whatsapp_number)
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Transform data to match frontend interface
      const transformedProducts = productsData?.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.categories?.name || '',
        images: product.product_images
          ?.sort((a, b) => a.display_order - b.display_order)
          ?.map(img => img.image_url) || [],
        details: product.product_details
          ?.sort((a, b) => a.display_order - b.display_order)
          ?.map(detail => detail.detail_text) || [],
        is_featured: product.is_featured,
        is_new: product.is_new,
        stock_quantity: product.stock_quantity,
        shop: product.shops ? {
          id: product.shops.id,
          name: product.shops.name,
          whatsapp_number: product.shops.whatsapp_number
        } : undefined
      })) || [];

      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCategories([]);
        return;
      }

      const { data, error } = await supabase
        .from('categories')
        .select('id, name, description')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des catégories');
    }
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]);
  }, []);

  const getNewProducts = () => products.filter(product => product.is_new);
  const getFeaturedProducts = () => products.filter(product => product.is_featured);

  return {
    products,
    categories,
    loading,
    error,
    refetch: () => Promise.all([fetchProducts(), fetchCategories()]),
    getNewProducts,
    getFeaturedProducts
  };
};