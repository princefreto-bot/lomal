import { createClient } from '@supabase/supabase-js';

// Configuration Supabase - LOMAL IMMOBILIER
const supabaseUrl = 'https://ikywolbkmlpuzkkifyti.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlreXdvbGJrbWxwdXpra2lmeXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTI1NzksImV4cCI6MjA4NjQ4ODU3OX0.1HrCmva2F9MSP7-PKNpZ-LqRhHIC1VDL5WLhnYjXoYQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la base de données Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          phone: string;
          created_at: string;
          subscription_active: boolean;
          subscription_expiry: string | null;
          is_admin: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          created_at?: string;
          subscription_active?: boolean;
          subscription_expiry?: string | null;
          is_admin?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          created_at?: string;
          subscription_active?: boolean;
          subscription_expiry?: string | null;
          is_admin?: boolean;
        };
      };
      rooms: {
        Row: {
          id: string;
          title: string;
          quartier: string;
          price: number;
          advance: number;
          width: number;
          length: number;
          surface: number;
          conditions: string;
          description: string;
          images: string[];
          available: boolean;
          featured: boolean;
          views: number;
          clicks: number;
          score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          quartier: string;
          price: number;
          advance: number;
          width: number;
          length: number;
          surface: number;
          conditions: string;
          description: string;
          images: string[];
          available?: boolean;
          featured?: boolean;
          views?: number;
          clicks?: number;
          score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          quartier?: string;
          price?: number;
          advance?: number;
          width?: number;
          length?: number;
          surface?: number;
          conditions?: string;
          description?: string;
          images?: string[];
          available?: boolean;
          featured?: boolean;
          views?: number;
          clicks?: number;
          score?: number;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          sender_name: string;
          content: string;
          timestamp: string;
          is_admin: boolean;
          read: boolean;
          conversation_id: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          sender_name: string;
          content: string;
          timestamp?: string;
          is_admin?: boolean;
          read?: boolean;
          conversation_id: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          sender_name?: string;
          content?: string;
          timestamp?: string;
          is_admin?: boolean;
          read?: boolean;
          conversation_id?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          user_phone: string;
          amount: number;
          type: 'subscription' | 'commission';
          status: 'pending' | 'success' | 'failed';
          created_at: string;
          reference: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_name: string;
          user_phone: string;
          amount: number;
          type: 'subscription' | 'commission';
          status?: 'pending' | 'success' | 'failed';
          created_at?: string;
          reference: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_name?: string;
          user_phone?: string;
          amount?: number;
          type?: 'subscription' | 'commission';
          status?: 'pending' | 'success' | 'failed';
          created_at?: string;
          reference?: string;
        };
      };
      commissions: {
        Row: {
          id: string;
          room_id: string;
          room_title: string;
          client_id: string;
          client_name: string;
          amount: number;
          closed_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          room_title: string;
          client_id: string;
          client_name: string;
          amount: number;
          closed_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          room_title?: string;
          client_id?: string;
          client_name?: string;
          amount?: number;
          closed_at?: string;
        };
      };
    };
  };
}

// Fonctions d'authentification Supabase
export const supabaseAuth = {
  // Envoyer OTP par SMS
  sendOtp: async (phone: string) => {
    const formattedPhone = phone.startsWith('+') ? phone : `+228${phone.replace(/\s/g, '')}`;
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });
    
    if (error) {
      console.error('Erreur envoi OTP:', error);
      throw error;
    }
    
    return data;
  },
  
  // Vérifier OTP
  verifyOtp: async (phone: string, token: string) => {
    const formattedPhone = phone.startsWith('+') ? phone : `+228${phone.replace(/\s/g, '')}`;
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: 'sms',
    });
    
    if (error) {
      console.error('Erreur vérification OTP:', error);
      throw error;
    }
    
    return data;
  },
  
  // Déconnexion
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Récupérer la session courante
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  
  // Récupérer l'utilisateur courant
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
};

// Fonctions pour les utilisateurs
export const supabaseUsers = {
  // Créer ou mettre à jour le profil utilisateur
  upsertProfile: async (userId: string, profile: { name: string; phone: string }) => {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        name: profile.name,
        phone: profile.phone,
        subscription_active: false,
        is_admin: false,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Récupérer le profil utilisateur
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
  
  // Mettre à jour l'abonnement
  updateSubscription: async (userId: string, active: boolean, expiry: Date | null) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        subscription_active: active,
        subscription_expiry: expiry?.toISOString() || null,
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Récupérer tous les utilisateurs (admin)
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};

// Fonctions pour les chambres
export const supabaseRooms = {
  // Récupérer toutes les chambres
  getAll: async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Récupérer les chambres disponibles
  getAvailable: async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('available', true)
      .order('score', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Récupérer une chambre par ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Créer une chambre
  create: async (room: Database['public']['Tables']['rooms']['Insert']) => {
    const { data, error } = await supabase
      .from('rooms')
      .insert(room)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Mettre à jour une chambre
  update: async (id: string, updates: Database['public']['Tables']['rooms']['Update']) => {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Supprimer une chambre
  delete: async (id: string) => {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  // Incrémenter les vues
  incrementViews: async (id: string) => {
    const { error } = await supabase.rpc('increment_room_views', { room_id: id });
    if (error) throw error;
  },
  
  // Incrémenter les clics
  incrementClicks: async (id: string) => {
    const { error } = await supabase.rpc('increment_room_clicks', { room_id: id });
    if (error) throw error;
  },
};

// Fonctions pour les messages (temps réel)
export const supabaseMessages = {
  // Récupérer les messages d'une conversation
  getByConversation: async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Envoyer un message
  send: async (message: Database['public']['Tables']['messages']['Insert']) => {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Marquer comme lu
  markAsRead: async (conversationId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .eq('is_admin', true);
    
    if (error) throw error;
  },
  
  // S'abonner aux nouveaux messages (temps réel)
  subscribeToMessages: (conversationId: string, callback: (message: any) => void) => {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => callback(payload.new)
      )
      .subscribe();
  },
  
  // Récupérer tous les messages (admin)
  getAll: async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};

// Fonctions pour les paiements
export const supabasePayments = {
  // Créer un paiement
  create: async (payment: Database['public']['Tables']['payments']['Insert']) => {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Mettre à jour le statut
  updateStatus: async (id: string, status: 'pending' | 'success' | 'failed') => {
    const { data, error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Récupérer tous les paiements
  getAll: async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Récupérer les paiements d'un utilisateur
  getByUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};

// Fonctions pour les commissions
export const supabaseCommissions = {
  // Créer une commission
  create: async (commission: Database['public']['Tables']['commissions']['Insert']) => {
    const { data, error } = await supabase
      .from('commissions')
      .insert(commission)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Récupérer toutes les commissions
  getAll: async () => {
    const { data, error } = await supabase
      .from('commissions')
      .select('*')
      .order('closed_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};

// Fonctions pour le stockage d'images
export const supabaseStorage = {
  // Upload une image
  uploadImage: async (file: File, bucket: string = 'room-images') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    
    if (error) throw error;
    
    // Récupérer l'URL publique
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  },
  
  // Supprimer une image
  deleteImage: async (path: string, bucket: string = 'room-images') => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
  },
};

export default supabase;
