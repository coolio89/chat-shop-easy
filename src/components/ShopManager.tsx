import { useState } from "react";
import { useShops, CreateShopData, UpdateShopData } from "@/hooks/useShops";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Store, Edit3, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const ShopManager = () => {
  const { userShop, loading, createShop, updateShop, deleteShop } = useShops();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateShopData>({
    name: "",
    description: "",
    whatsapp_number: ""
  });

  const [editData, setEditData] = useState<UpdateShopData>({
    id: "",
    name: "",
    description: "",
    whatsapp_number: "",
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      whatsapp_number: ""
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Le nom de la boutique est requis");
      return;
    }

    try {
      setSubmitting(true);
      await createShop(formData);
      toast.success("Boutique créée avec succès!");
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Erreur lors de la création de la boutique");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (userShop) {
      setEditData({
        id: userShop.id,
        name: userShop.name,
        description: userShop.description || "",
        whatsapp_number: userShop.whatsapp_number || "",
        is_active: userShop.is_active
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.name.trim()) {
      toast.error("Le nom de la boutique est requis");
      return;
    }

    try {
      setSubmitting(true);
      await updateShop(editData);
      toast.success("Boutique mise à jour avec succès!");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la boutique");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userShop) return;

    if (confirm("Êtes-vous sûr de vouloir supprimer votre boutique ? Cette action est irréversible.")) {
      try {
        setSubmitting(true);
        await deleteShop(userShop.id);
        toast.success("Boutique supprimée avec succès!");
      } catch (error) {
        toast.error("Erreur lors de la suppression de la boutique");
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          Ma Boutique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {userShop ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{userShop.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {userShop.description || "Aucune description"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  WhatsApp: {userShop.whatsapp_number || "Non défini"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${userShop.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-muted-foreground">
                    {userShop.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  disabled={submitting}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={submitting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune boutique</h3>
            <p className="text-muted-foreground mb-4">
              Créez votre boutique personnelle pour vendre vos produits
            </p>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer ma boutique
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle boutique</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la boutique *</Label>
                    <Input
                      id="name"
                      placeholder="Mon Petit Commerce"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Description de votre boutique..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      placeholder="22967676767"
                      value={formData.whatsapp_number}
                      onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? "Création..." : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier ma boutique</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom de la boutique *</Label>
                <Input
                  id="edit-name"
                  placeholder="Mon Petit Commerce"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Description de votre boutique..."
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-whatsapp">Numéro WhatsApp</Label>
                <Input
                  id="edit-whatsapp"
                  placeholder="22967676767"
                  value={editData.whatsapp_number}
                  onChange={(e) => setEditData({...editData, whatsapp_number: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={editData.is_active}
                  onCheckedChange={(checked) => setEditData({...editData, is_active: checked})}
                />
                <Label htmlFor="is-active">Boutique active</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? "Mise à jour..." : "Sauvegarder"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ShopManager;