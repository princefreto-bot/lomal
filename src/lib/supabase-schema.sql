-- ============================================
-- SCHEMA SUPABASE POUR LOMAL IMMOBILIER
-- ============================================
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. EXTENSION UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. TABLE USERS (Profils utilisateurs)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_active BOOLEAN DEFAULT FALSE,
    subscription_expiry TIMESTAMP WITH TIME ZONE,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Index pour recherche rapide par téléphone
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);

-- RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Politique: Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Politique: Permettre l'insertion lors de l'inscription
CREATE POLICY "Enable insert for authenticated users" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 3. TABLE ROOMS (Chambres)
-- ============================================
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    quartier VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    advance INTEGER NOT NULL,
    width DECIMAL(5,2) NOT NULL,
    length DECIMAL(5,2) NOT NULL,
    surface DECIMAL(6,2) GENERATED ALWAYS AS (width * length) STORED,
    conditions TEXT,
    description TEXT,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    available BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    score INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche par quartier et disponibilité
CREATE INDEX IF NOT EXISTS idx_rooms_quartier ON public.rooms(quartier);
CREATE INDEX IF NOT EXISTS idx_rooms_available ON public.rooms(available);
CREATE INDEX IF NOT EXISTS idx_rooms_price ON public.rooms(price);
CREATE INDEX IF NOT EXISTS idx_rooms_score ON public.rooms(score DESC);

-- RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Politique: Tout le monde peut voir les chambres
CREATE POLICY "Anyone can view rooms" ON public.rooms
    FOR SELECT USING (true);

-- Politique: Seuls les admins peuvent modifier les chambres
CREATE POLICY "Admins can manage rooms" ON public.rooms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- ============================================
-- 4. TABLE MESSAGES (Chat)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_admin BOOLEAN DEFAULT FALSE,
    read BOOLEAN DEFAULT FALSE,
    conversation_id UUID NOT NULL
);

-- Index pour recherche par conversation
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON public.messages(timestamp);

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leurs propres messages
CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (
        sender_id = auth.uid() OR 
        conversation_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Politique: Les utilisateurs peuvent envoyer des messages
CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Activer Realtime pour les messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============================================
-- 5. TABLE PAYMENTS (Paiements)
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    amount INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('subscription', 'commission')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reference VARCHAR(50) UNIQUE NOT NULL
);

-- Index pour recherche
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.payments(created_at);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leurs propres paiements
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Politique: Permettre la création de paiements
CREATE POLICY "Users can create payments" ON public.payments
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================
-- 6. TABLE COMMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE SET NULL,
    room_title VARCHAR(255) NOT NULL,
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    closed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_commissions_date ON public.commissions(closed_at);

-- RLS
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Politique: Seuls les admins peuvent voir les commissions
CREATE POLICY "Admins can view commissions" ON public.commissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- ============================================
-- 7. FONCTIONS RPC
-- ============================================

-- Fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_room_views(room_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.rooms 
    SET views = views + 1 
    WHERE id = room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter les clics
CREATE OR REPLACE FUNCTION increment_room_clicks(room_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.rooms 
    SET clicks = clicks + 1,
        score = LEAST(100, score + 1)
    WHERE id = room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques admin
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM public.users),
        'active_subscriptions', (SELECT COUNT(*) FROM public.users WHERE subscription_active = true),
        'total_rooms', (SELECT COUNT(*) FROM public.rooms),
        'available_rooms', (SELECT COUNT(*) FROM public.rooms WHERE available = true),
        'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'success'),
        'subscription_revenue', (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'success' AND type = 'subscription'),
        'commission_revenue', (SELECT COALESCE(SUM(amount), 0) FROM public.commissions),
        'total_messages', (SELECT COUNT(*) FROM public.messages)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. STORAGE BUCKETS
-- ============================================
-- Créez ces buckets manuellement dans le dashboard Supabase Storage:
-- 1. room-images (public)

-- ============================================
-- 9. DONNÉES DE DÉMONSTRATION
-- ============================================

-- Insérer des chambres de démonstration
INSERT INTO public.rooms (title, quartier, price, advance, width, length, conditions, description, images, available, featured, views, clicks, score) VALUES
('Chambre moderne Tokoin', 'Tokoin', 25000, 50000, 4, 5, 'Célibataire ou couple sans enfant, pas d''animaux', 'Belle chambre lumineuse avec carrelage moderne, proche des commodités. Eau et électricité inclus.', ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], true, true, 245, 67, 92),
('Studio Bè Klikamé', 'Bè', 20000, 40000, 3.5, 4, 'Étudiant ou travailleur, calme exigé', 'Petit studio propre et sécurisé, idéal pour étudiant. Quartier calme.', ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], true, false, 156, 34, 78),
('Grande chambre Adidogomé', 'Adidogomé', 30000, 60000, 5, 6, 'Famille acceptée, maximum 3 personnes', 'Spacieuse chambre avec douche interne et WC. Cour commune propre.', ARRAY['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'], true, true, 312, 89, 95),
('Chambre Agbalépédogan', 'Agbalépédogan', 22000, 44000, 4, 4, 'Célibataire uniquement', 'Chambre confortable dans un quartier résidentiel calme. Sécurité 24h.', ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'], true, false, 98, 23, 72),
('Chambre étudiante Agoè', 'Agoè', 15000, 30000, 3, 4, 'Étudiant avec garant', 'Petite chambre économique proche de l''Université de Lomé.', ARRAY['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'], true, false, 421, 112, 88),
('Chambre luxe Hédzranawoé', 'Hédzranawoé', 45000, 90000, 5, 6, 'Cadre ou expatrié, contrat minimum 6 mois', 'Chambre haut standing avec climatisation, douche moderne et parking.', ARRAY['https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'], true, true, 178, 56, 90),
('Chambre Nyékonakpoé', 'Nyékonakpoé', 18000, 36000, 3.5, 4.5, 'Travailleur ou étudiant', 'Chambre simple et propre, accès facile aux transports.', ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'], true, false, 134, 29, 68),
('Studio Djidjolé', 'Djidjolé', 28000, 56000, 4, 5, 'Couple ou célibataire', 'Studio avec coin cuisine aménagé et balcon. Vue dégagée.', ARRAY['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'], true, true, 267, 78, 85)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSTRUCTIONS SUPPLÉMENTAIRES
-- ============================================
-- 
-- 1. Activez l'authentification par téléphone dans:
--    Authentication > Providers > Phone
--    
-- 2. Configurez un provider SMS (Twilio, etc.) dans:
--    Authentication > Providers > Phone > SMS Provider
--
-- 3. Créez le bucket Storage "room-images" en public:
--    Storage > Create bucket > "room-images" > Public
--
-- 4. Configurez les variables d'environnement:
--    VITE_SUPABASE_URL=votre-url
--    VITE_SUPABASE_ANON_KEY=votre-clé
