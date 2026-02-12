import { useEffect, useState, useCallback } from 'react';
import { supabase, supabaseAuth, supabaseUsers, supabaseRooms, supabaseMessages, supabasePayments } from '@/lib/supabase';
import { useStore } from '@/store';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Hook pour l'authentification Supabase
export function useSupabaseAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, logout: storeLogout, setCurrentPage } = useStore();

  // Envoyer OTP
  const sendOtp = useCallback(async (phone: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await supabaseAuth.sendOtp(phone);
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'envoi du code';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Vérifier OTP
  const verifyOtp = useCallback(async (phone: string, token: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { user: authUser } = await supabaseAuth.verifyOtp(phone, token);
      
      if (authUser) {
        // Créer/mettre à jour le profil utilisateur
        const profile = await supabaseUsers.upsertProfile(authUser.id, { name, phone });
        
        // Connecter dans le store
        login({
          id: profile.id,
          name: profile.name,
          phone: profile.phone,
          createdAt: new Date(profile.created_at),
          subscriptionActive: profile.subscription_active,
          subscriptionExpiry: profile.subscription_expiry ? new Date(profile.subscription_expiry) : null,
          isAdmin: profile.is_admin,
        });
        
        setCurrentPage('dashboard');
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Code invalide';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [login, setCurrentPage]);

  // Déconnexion
  const signOut = useCallback(async () => {
    try {
      await supabaseAuth.signOut();
      storeLogout();
      setCurrentPage('home');
    } catch (err: unknown) {
      console.error('Erreur déconnexion:', err);
    }
  }, [storeLogout, setCurrentPage]);

  // Écouter les changements d'authentification
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profile = await supabaseUsers.getProfile(session.user.id);
          if (profile) {
            login({
              id: profile.id,
              name: profile.name,
              phone: profile.phone,
              createdAt: new Date(profile.created_at),
              subscriptionActive: profile.subscription_active,
              subscriptionExpiry: profile.subscription_expiry ? new Date(profile.subscription_expiry) : null,
              isAdmin: profile.is_admin,
            });
          }
        } catch (err) {
          console.error('Erreur chargement profil:', err);
        }
      } else if (event === 'SIGNED_OUT') {
        storeLogout();
      }
    });

    return () => subscription.unsubscribe();
  }, [login, storeLogout]);

  return { sendOtp, verifyOtp, signOut, loading, error };
}

// Hook pour les chambres Supabase
export function useSupabaseRooms() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setRooms, addRoom, updateRoom, deleteRoom } = useStore();

  // Charger les chambres
  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const rooms = await supabaseRooms.getAvailable();
      setRooms(rooms.map(room => ({
        id: room.id,
        title: room.title,
        quartier: room.quartier,
        price: room.price,
        advance: room.advance,
        width: room.width,
        length: room.length,
        surface: room.surface,
        conditions: room.conditions || '',
        description: room.description || '',
        images: room.images || [],
        available: room.available,
        featured: room.featured,
        views: room.views,
        clicks: room.clicks,
        score: room.score,
        createdAt: new Date(room.created_at),
      })));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur chargement des chambres';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setRooms]);

  // Créer une chambre
  const createRoom = useCallback(async (roomData: Parameters<typeof supabaseRooms.create>[0]) => {
    setLoading(true);
    setError(null);
    
    try {
      const room = await supabaseRooms.create(roomData);
      addRoom({
        id: room.id,
        title: room.title,
        quartier: room.quartier,
        price: room.price,
        advance: room.advance,
        width: room.width,
        length: room.length,
        surface: room.surface,
        conditions: room.conditions || '',
        description: room.description || '',
        images: room.images || [],
        available: room.available,
        featured: room.featured,
        views: room.views,
        clicks: room.clicks,
        score: room.score,
        createdAt: new Date(room.created_at),
      });
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur création chambre';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [addRoom]);

  // Mettre à jour une chambre
  const editRoom = useCallback(async (id: string, updates: Parameters<typeof supabaseRooms.update>[1]) => {
    try {
      await supabaseRooms.update(id, updates);
      updateRoom(id, updates as any);
      return true;
    } catch (err: unknown) {
      console.error('Erreur mise à jour:', err);
      return false;
    }
  }, [updateRoom]);

  // Supprimer une chambre
  const removeRoom = useCallback(async (id: string) => {
    try {
      await supabaseRooms.delete(id);
      deleteRoom(id);
      return true;
    } catch (err: unknown) {
      console.error('Erreur suppression:', err);
      return false;
    }
  }, [deleteRoom]);

  // Incrémenter vues/clics
  const trackView = useCallback(async (id: string) => {
    try {
      await supabaseRooms.incrementViews(id);
    } catch (err) {
      console.error('Erreur tracking vue:', err);
    }
  }, []);

  const trackClick = useCallback(async (id: string) => {
    try {
      await supabaseRooms.incrementClicks(id);
    } catch (err) {
      console.error('Erreur tracking clic:', err);
    }
  }, []);

  return { loadRooms, createRoom, editRoom, removeRoom, trackView, trackClick, loading, error };
}

// Hook pour les messages temps réel
export function useSupabaseMessages(conversationId: string | null) {
  const [loading, setLoading] = useState(false);
  const { addMessage } = useStore();

  // Charger les messages
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    
    setLoading(true);
    try {
      const messages = await supabaseMessages.getByConversation(conversationId);
      messages.forEach(msg => {
        addMessage({
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.sender_name,
          senderPhone: msg.sender_phone,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isAdmin: msg.is_admin,
          read: msg.read,
          conversationId: msg.conversation_id,
        });
      });
    } catch (err) {
      console.error('Erreur chargement messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, addMessage]);

  // Envoyer un message
  const sendMessage = useCallback(async (content: string, senderId: string, senderName: string) => {
    if (!conversationId) return false;
    
    try {
      const message = await supabaseMessages.send({
        sender_id: senderId,
        sender_name: senderName,
        content,
        conversation_id: conversationId,
        is_admin: false,
      });
      
      addMessage({
        id: message.id,
        senderId: message.sender_id,
        senderName: message.sender_name,
        senderPhone: message.sender_phone,
        content: message.content,
        timestamp: new Date(message.timestamp),
        isAdmin: message.is_admin,
        read: message.read,
        conversationId: message.conversation_id,
      });
      
      return true;
    } catch (err) {
      console.error('Erreur envoi message:', err);
      return false;
    }
  }, [conversationId, addMessage]);

  // S'abonner aux nouveaux messages temps réel
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabaseMessages.subscribeToMessages(conversationId, (newMessage) => {
      addMessage({
        id: newMessage.id,
        senderId: newMessage.sender_id,
        senderName: newMessage.sender_name,
        senderPhone: newMessage.sender_phone,
        content: newMessage.content,
        timestamp: new Date(newMessage.timestamp),
        isAdmin: newMessage.is_admin,
        read: newMessage.read,
        conversationId: newMessage.conversation_id,
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, addMessage]);

  return { loadMessages, sendMessage, loading };
}

// Hook pour les paiements
export function useSupabasePayments() {
  const { user, activateSubscription, addPayment } = useStore();

  // Traiter un paiement d'abonnement
  const processSubscription = useCallback(async (paymentReference: string) => {
    if (!user) return false;

    try {
      // Créer le paiement
      const payment = await supabasePayments.create({
        user_id: user.id,
        user_name: user.name,
        user_phone: user.phone,
        amount: 1000,
        type: 'subscription',
        status: 'success', // En production, commencer par 'pending' et webhook
        reference: paymentReference,
      });

      // Mettre à jour l'abonnement
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      
      await supabaseUsers.updateSubscription(user.id, true, expiry);
      
      // Mettre à jour le store local
      activateSubscription();
      addPayment({
        id: payment.id,
        userId: payment.user_id,
        userName: payment.user_name,
        userPhone: payment.user_phone,
        amount: payment.amount,
        type: payment.type,
        status: payment.status,
        createdAt: new Date(payment.created_at),
        reference: payment.reference,
      });

      return true;
    } catch (err) {
      console.error('Erreur paiement:', err);
      return false;
    }
  }, [user, activateSubscription, addPayment]);

  return { processSubscription };
}

// Type pour l'utilisateur Supabase exporté
export type { SupabaseUser };
