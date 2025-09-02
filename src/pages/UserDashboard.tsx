import { useState } from 'react';
import { ShoppingBag, Package, Heart, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  items: CartItem[];
}

const UserDashboard = () => {
  const [cartItems] = useState<CartItem[]>([]);
  const [orders] = useState<Order[]>([]);
  const [wishlistItems] = useState<CartItem[]>([]);

  const getTotalCart = () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      confirmed: { label: 'Confirmée', variant: 'default' as const },
      shipped: { label: 'Expédiée', variant: 'outline' as const },
      delivered: { label: 'Livrée', variant: 'default' as const }
    };
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-light mb-2">Mon Espace</h1>
            <p className="text-muted-foreground">Gérez vos commandes et votre panier</p>
          </div>

          <Tabs defaultValue="cart" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cart" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Panier ({cartItems.length})
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Commandes ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favoris ({wishlistItems.length})
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
            </TabsList>

            {/* Panier */}
            <TabsContent value="cart" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mon Panier</CardTitle>
                  <CardDescription>
                    {cartItems.length} article{cartItems.length > 1 ? 's' : ''} dans votre panier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Votre panier est vide</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-muted-foreground">Quantité: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{(item.price * item.quantity).toLocaleString()} XOF</p>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-medium">
                          <span>Total:</span>
                          <span>{getTotalCart().toLocaleString()} XOF</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commandes */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mes Commandes</CardTitle>
                  <CardDescription>Suivez l'état de vos commandes</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune commande pour le moment</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-medium">Commande #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge {...getStatusBadge(order.status)}>
                                {getStatusBadge(order.status).label}
                              </Badge>
                              <p className="font-medium mt-1">{order.total.toLocaleString()} XOF</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <span className="text-sm">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favoris */}
            <TabsContent value="wishlist" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mes Favoris</CardTitle>
                  <CardDescription>Produits que vous avez sauvegardés</CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun favori pour le moment</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 space-y-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-primary font-medium">{item.price.toLocaleString()} XOF</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profil */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mon Profil</CardTitle>
                  <CardDescription>Informations de votre compte</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Nom complet</label>
                        <div className="mt-1 p-2 border rounded-lg bg-muted/50">
                          Utilisateur
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <div className="mt-1 p-2 border rounded-lg bg-muted/50">
                          user@example.com
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Adresse de livraison</label>
                      <div className="mt-1 p-3 border rounded-lg bg-muted/50">
                        <p>123 Rue Example</p>
                        <p>Abidjan, Côte d'Ivoire</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;