import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Shop {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  whatsapp_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateShopData {
  name: string;
  description?: string;
  whatsapp_number?: string;
}

export interface UpdateShopData extends CreateShopData {
  id: string;
  is_active?: boolean;
}

export const useShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [userShop, setUserShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setShops(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserShop = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setUserShop(data);
      } else {
        setUserShop(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la boutique');
    }
  };

  useEffect(() => {
    Promise.all([fetchShops(), fetchUserShop()]);
  }, []);

  const createShop = async (shopData: CreateShopData): Promise<Shop> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('shops')
      .insert([{
        ...shopData,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    
    await fetchUserShop();
    await fetchShops();
    
    return data;
  };

  const updateShop = async (shopData: UpdateShopData): Promise<Shop> => {
    const { id, ...updateData } = shopData;
    
    const { data, error } = await supabase
      .from('shops')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    await fetchUserShop();
    await fetchShops();
    
    return data;
  };

  const deleteShop = async (shopId: string): Promise<void> => {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', shopId);

    if (error) throw error;
    
    setUserShop(null);
    await fetchShops();
  };

  return {
    shops,
    userShop,
    loading,
    error,
    createShop,
    updateShop,
    deleteShop,
    refetch: () => Promise.all([fetchShops(), fetchUserShop()])
  };
};