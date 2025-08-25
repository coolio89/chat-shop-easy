-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_new BOOLEAN NOT NULL DEFAULT false,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product_images table
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product_details table
CREATE TABLE public.product_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  detail_text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_details ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (everyone can see products)
CREATE POLICY "Categories are publicly readable" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Products are publicly readable" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Product images are publicly readable" 
ON public.product_images 
FOR SELECT 
USING (true);

CREATE POLICY "Product details are publicly readable" 
ON public.product_details 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_products_new ON public.products(is_new);
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_product_images_order ON public.product_images(product_id, display_order);
CREATE INDEX idx_product_details_product_id ON public.product_details(product_id);
CREATE INDEX idx_product_details_order ON public.product_details(product_id, display_order);

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
('Électronique', 'Appareils électroniques et gadgets technologiques'),
('Mode', 'Vêtements et accessoires de mode'),
('Gaming', 'Équipements et accessoires de jeu');

-- Insert sample products with their relations
DO $$
DECLARE
  electronic_cat_id UUID;
  fashion_cat_id UUID;
  gaming_cat_id UUID;
  iphone_id UUID;
  airpods_id UUID;
  macbook_id UUID;
  tshirt_id UUID;
  gaming_headset_id UUID;
  android_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO electronic_cat_id FROM public.categories WHERE name = 'Électronique';
  SELECT id INTO fashion_cat_id FROM public.categories WHERE name = 'Mode';
  SELECT id INTO gaming_cat_id FROM public.categories WHERE name = 'Gaming';
  
  -- Insert iPhone
  INSERT INTO public.products (name, description, price, category_id, is_new, stock_quantity)
  VALUES ('iPhone 15 Pro Max', 'Le smartphone le plus avancé avec puce A17 Pro et caméra 48MP', 750000, electronic_cat_id, true, 10)
  RETURNING id INTO iphone_id;
  
  INSERT INTO public.product_images (product_id, image_url, alt_text, display_order) VALUES
  (iphone_id, '/src/assets/smartphone.jpg', 'iPhone 15 Pro Max face avant', 0),
  (iphone_id, '/src/assets/smartphone-back.jpg', 'iPhone 15 Pro Max face arrière', 1);
  
  INSERT INTO public.product_details (product_id, detail_text, display_order) VALUES
  (iphone_id, 'Écran 6.7 pouces Super Retina XDR', 0),
  (iphone_id, 'Puce A17 Pro', 1),
  (iphone_id, 'Caméra 48MP', 2),
  (iphone_id, 'Batterie longue durée', 3),
  (iphone_id, '5G ultra-rapide', 4);
  
  -- Insert AirPods
  INSERT INTO public.products (name, description, price, category_id, is_new, stock_quantity)
  VALUES ('AirPods Pro (2ème gen)', 'Écouteurs sans fil avec réduction de bruit active', 175000, electronic_cat_id, true, 15)
  RETURNING id INTO airpods_id;
  
  INSERT INTO public.product_images (product_id, image_url, alt_text, display_order) VALUES
  (airpods_id, '/src/assets/headphones.jpg', 'AirPods Pro vue principale', 0),
  (airpods_id, '/src/assets/headphones-side.jpg', 'AirPods Pro vue de côté', 1);
  
  INSERT INTO public.product_details (product_id, detail_text, display_order) VALUES
  (airpods_id, 'Réduction de bruit active', 0),
  (airpods_id, 'Audio spatial', 1),
  (airpods_id, 'Résistance à l''eau IPX4', 2),
  (airpods_id, 'Jusqu''à 30h d''écoute', 3),
  (airpods_id, 'Compatible Siri', 4);
  
  -- Insert MacBook
  INSERT INTO public.products (name, description, price, category_id, is_new, stock_quantity)
  VALUES ('MacBook Air M2', 'Ordinateur portable ultra-fin avec puce M2 et écran Liquid Retina', 815000, electronic_cat_id, true, 8)
  RETURNING id INTO macbook_id;
  
  INSERT INTO public.product_images (product_id, image_url, alt_text, display_order) VALUES
  (macbook_id, '/src/assets/laptop.jpg', 'MacBook Air M2 ouvert', 0),
  (macbook_id, '/src/assets/laptop-closed.jpg', 'MacBook Air M2 fermé', 1);
  
  INSERT INTO public.product_details (product_id, detail_text, display_order) VALUES
  (macbook_id, 'Puce M2 8 cœurs', 0),
  (macbook_id, 'Écran Liquid Retina 13.6 pouces', 1),
  (macbook_id, '18h d''autonomie', 2),
  (macbook_id, 'Ultra-fin 11.3mm', 3),
  (macbook_id, 'Caméra FaceTime HD 1080p', 4);
  
  -- Insert T-shirt
  INSERT INTO public.products (name, description, price, category_id, is_new, stock_quantity)
  VALUES ('T-shirt Premium Coton', 'T-shirt en coton bio premium, coupe moderne et confortable', 18000, fashion_cat_id, true, 25)
  RETURNING id INTO tshirt_id;
  
  INSERT INTO public.product_images (product_id, image_url, alt_text, display_order) VALUES
  (tshirt_id, '/src/assets/tshirt.jpg', 'T-shirt premium coton', 0),
  (tshirt_id, '/src/assets/tshirt-hanging.jpg', 'T-shirt premium suspendu', 1);
  
  INSERT INTO public.product_details (product_id, detail_text, display_order) VALUES
  (tshirt_id, '100% coton bio', 0),
  (tshirt_id, 'Coupe moderne', 1),
  (tshirt_id, 'Résistant au lavage', 2),
  (tshirt_id, 'Tailles S à XXL', 3),
  (tshirt_id, 'Certifié OEKO-TEX', 4);
  
  -- Insert Gaming Headset
  INSERT INTO public.products (name, description, price, category_id, is_new, stock_quantity)
  VALUES ('Casque Gaming Pro', 'Casque gaming avec micro détachable et son surround 7.1', 99000, gaming_cat_id, false, 12)
  RETURNING id INTO gaming_headset_id;
  
  INSERT INTO public.product_images (product_id, image_url, alt_text, display_order) VALUES
  (gaming_headset_id, '/src/assets/headphones.jpg', 'Casque Gaming Pro', 0),
  (gaming_headset_id, '/src/assets/headphones-side.jpg', 'Casque Gaming Pro profil', 1);
  
  INSERT INTO public.product_details (product_id, detail_text, display_order) VALUES
  (gaming_headset_id, 'Son surround 7.1', 0),
  (gaming_headset_id, 'Micro antibruit détachable', 1),
  (gaming_headset_id, 'Coussinets en mousse mémoire', 2),
  (gaming_headset_id, 'Compatible PC/Console', 3),
  (gaming_headset_id, 'Éclairage RGB', 4);
  
  -- Insert Android Phone
  INSERT INTO public.products (name, description, price, category_id, is_new, stock_quantity)
  VALUES ('Smartphone Android Flagship', 'Smartphone Android haut de gamme avec écran 120Hz et triple caméra', 565000, electronic_cat_id, false, 6)
  RETURNING id INTO android_id;
  
  INSERT INTO public.product_images (product_id, image_url, alt_text, display_order) VALUES
  (android_id, '/src/assets/smartphone.jpg', 'Smartphone Android Flagship', 0),
  (android_id, '/src/assets/smartphone-back.jpg', 'Smartphone Android dos', 1);
  
  INSERT INTO public.product_details (product_id, detail_text, display_order) VALUES
  (android_id, 'Écran AMOLED 120Hz', 0),
  (android_id, 'Triple caméra 108MP', 1),
  (android_id, 'Charge rapide 65W', 2),
  (android_id, '8GB RAM + 256GB', 3),
  (android_id, 'Android 14', 4);
END $$;