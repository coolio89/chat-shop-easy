import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProducts, Category } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CategoryManager = () => {
  const { categories, refetch } = useProducts();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [editData, setEditData] = useState<{ [key: string]: { name: string; description: string } }>({});

  const resetForm = () => {
    setFormData({ name: '', description: '' });
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null
        });

      if (error) throw error;

      toast.success('Catégorie créée avec succès');
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category.id);
    setEditData(prev => ({
      ...prev,
      [category.id]: {
        name: category.name,
        description: category.description || ''
      }
    }));
  };

  const handleSaveEdit = async (categoryId: string) => {
    const data = editData[categoryId];
    if (!data?.name.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: data.name.trim(),
          description: data.description.trim() || null
        })
        .eq('id', categoryId);

      if (error) throw error;

      toast.success('Catégorie mise à jour avec succès');
      setEditingCategory(null);
      refetch();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ?`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast.success('Catégorie supprimée avec succès');
      refetch();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = (categoryId: string) => {
    setEditingCategory(null);
    setEditData(prev => {
      const newData = { ...prev };
      delete newData[categoryId];
      return newData;
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestion des Catégories</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez les catégories de produits
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle Catégorie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nom de la catégorie *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Smartphones, Laptops..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de la catégorie (optionnel)"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleCreate} disabled={loading}>
                    {loading ? 'Création...' : 'Créer'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune catégorie créée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                {editingCategory === category.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editData[category.id]?.name || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        [category.id]: {
                          ...prev[category.id],
                          name: e.target.value
                        }
                      }))}
                      placeholder="Nom de la catégorie"
                    />
                    <Textarea
                      value={editData[category.id]?.description || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        [category.id]: {
                          ...prev[category.id],
                          description: e.target.value
                        }
                      }))}
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelEdit(category.id)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(category.id)}
                        disabled={loading}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{category.name}</h3>
                        <Badge variant="secondary">ID: {category.id.slice(0, 8)}</Badge>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        disabled={loading}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={loading}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryManager;