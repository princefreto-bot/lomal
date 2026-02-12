import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store';
import type { Message } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useMessages() {
  const { user, messages, addMessage, isAuthenticated } = useStore();

  // S'abonner aux messages en temps réel
  useEffect(() => {
    if (!user?.id || !isAuthenticated) return;

    let channel: RealtimeChannel;

    const setupRealtime = async () => {
      // S'abonner aux nouveaux messages de la conversation
      channel = supabase
        .channel(`messages:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${user.id}`,
          },
          (payload) => {
            const newMessage = payload.new as {
              id: string;
              sender_id: string;
              sender_name: string;
              sender_phone?: string;
              content: string;
              timestamp: string;
              is_admin: boolean;
              read: boolean;
              conversation_id: string;
            };

            // Éviter les doublons
            const existingMessage = messages.find((m) => m.id === newMessage.id);
            if (!existingMessage) {
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
            }
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id, isAuthenticated, messages, addMessage]);

  // Charger les messages existants
  const loadMessages = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', user.id)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Erreur chargement messages:', error);
        return;
      }

      if (data) {
        const loadedMessages: Message[] = data.map((msg) => ({
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.sender_name,
          senderPhone: msg.sender_phone,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isAdmin: msg.is_admin,
          read: msg.read,
          conversationId: msg.conversation_id,
        }));

        // Mettre à jour le store avec les messages chargés
        useStore.setState({ messages: loadedMessages });
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [user?.id]);

  // Envoyer un message
  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !content.trim()) return { success: false };

    const newMessage = {
      sender_id: user.id,
      sender_name: user.name,
      sender_phone: user.phone,
      content: content.trim(),
      is_admin: false,
      read: false,
      conversation_id: user.id,
    };

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();

      if (error) {
        console.error('Erreur envoi message:', error);
        
        // Mode démo - ajouter localement
        const localMessage: Message = {
          id: crypto.randomUUID(),
          senderId: user.id,
          senderName: user.name,
          senderPhone: user.phone,
          content: content.trim(),
          timestamp: new Date(),
          isAdmin: false,
          read: false,
          conversationId: user.id,
        };
        
        addMessage(localMessage);
        
        // Simuler réponse admin après 2 secondes
        setTimeout(() => {
          const adminResponse: Message = {
            id: crypto.randomUUID(),
            senderId: 'admin',
            senderName: 'LOMAL Support',
            content: getAutoResponse(content),
            timestamp: new Date(),
            isAdmin: true,
            read: false,
            conversationId: user.id,
          };
          addMessage(adminResponse);
        }, 2000);

        return { success: true, demo: true };
      }

      if (data) {
        addMessage({
          id: data.id,
          senderId: data.sender_id,
          senderName: data.sender_name,
          senderPhone: data.sender_phone,
          content: data.content,
          timestamp: new Date(data.timestamp),
          isAdmin: false,
          read: false,
          conversationId: data.conversation_id,
        });

        return { success: true };
      }

      return { success: false };
    } catch (err) {
      console.error('Erreur:', err);
      return { success: false };
    }
  }, [user, addMessage]);

  // Marquer les messages comme lus
  const markAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', user.id)
        .eq('is_admin', true)
        .eq('read', false);

      useStore.getState().markMessagesRead();
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [user?.id]);

  // Messages non lus
  const unreadMessages = messages.filter((m) => m.isAdmin && !m.read);

  return {
    messages,
    loadMessages,
    sendMessage,
    markAsRead,
    unreadCount: unreadMessages.length,
  };
}

// Réponses automatiques pour le mode démo
function getAutoResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('visite') || lowerMessage.includes('visiter')) {
    return "Bonjour ! Merci pour votre intérêt. Je vais organiser une visite pour vous. Quel jour vous conviendrait le mieux cette semaine ?";
  }

  if (lowerMessage.includes('prix') || lowerMessage.includes('loyer') || lowerMessage.includes('combien')) {
    return "Les prix varient selon les quartiers et la taille des chambres. Avez-vous vu une chambre qui vous intéresse ? Je peux vous donner plus de détails.";
  }

  if (lowerMessage.includes('disponible') || lowerMessage.includes('libre')) {
    return "Je vérifie la disponibilité pour vous. Pouvez-vous me préciser quel quartier vous intéresse ?";
  }

  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('bonsoir')) {
    return "Bonjour ! Bienvenue chez LOMAL IMMOBILIER. Comment puis-je vous aider à trouver la chambre idéale à Lomé ?";
  }

  if (lowerMessage.includes('merci')) {
    return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions. Je suis là pour vous aider.";
  }

  return "Merci pour votre message ! Je reviens vers vous très rapidement. En attendant, n'hésitez pas à parcourir nos annonces.";
}
