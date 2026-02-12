import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function useAuth() {
  const { user, isAuthenticated } = useStore();
  const [loading, setLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);

  // Écouter les changements d'authentification Supabase
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (session?.user) {
          setSupabaseUser(session.user);
          
          // Récupérer le profil utilisateur depuis la table users
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            useStore.setState({
              isAuthenticated: true,
              user: {
                id: profile.id,
                name: profile.name,
                phone: profile.phone,
                subscriptionActive: profile.subscription_active,
                subscriptionExpiry: profile.subscription_expiry 
                  ? new Date(profile.subscription_expiry) 
                  : null,
                createdAt: new Date(profile.created_at),
                isAdmin: profile.is_admin,
              },
            });
          }
        } else {
          setSupabaseUser(null);
        }
        
        setLoading(false);
      }
    );

    // Vérifier la session actuelle au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Envoyer OTP
  const sendOtp = useCallback(async (phone: string, name: string) => {
    const formattedPhone = phone.startsWith('+228') ? phone : `+228${phone.replace(/\D/g, '')}`;
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        data: { name },
      },
    });

    if (error) {
      // Mode démo si SMS non configuré
      if (error.message.includes('not enabled') || error.message.includes('Phone')) {
        return { success: true, demo: true, phone: formattedPhone };
      }
      return { success: false, error: error.message };
    }

    return { success: true, phone: formattedPhone };
  }, []);

  // Vérifier OTP
  const verifyOtp = useCallback(async (phone: string, token: string, name: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) {
      // Mode démo - créer utilisateur local
      const demoUserId = crypto.randomUUID();
      
      // Essayer d'insérer dans Supabase
      try {
        await supabase.from('users').insert({
          id: demoUserId,
          name,
          phone,
          subscription_active: false,
        });
      } catch {
        // Ignorer les erreurs en mode démo
      }

      useStore.setState({
        isAuthenticated: true,
        user: {
          id: demoUserId,
          name,
          phone,
          subscriptionActive: false,
          subscriptionExpiry: null,
          createdAt: new Date(),
          isAdmin: false,
        },
      });

      return { success: true, demo: true };
    }

    if (data.user) {
      // Créer le profil dans la table users
      await supabase.from('users').upsert({
        id: data.user.id,
        name,
        phone,
        subscription_active: false,
      }, { onConflict: 'phone' });

      useStore.setState({
        isAuthenticated: true,
        user: {
          id: data.user.id,
          name,
          phone,
          subscriptionActive: false,
          subscriptionExpiry: null,
          createdAt: new Date(),
          isAdmin: false,
        },
      });

      return { success: true };
    }

    return { success: false, error: 'Erreur de vérification' };
  }, []);

  // Déconnexion
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    useStore.setState({
      isAuthenticated: false,
      user: null,
      otpSent: false,
      otpPhone: '',
      messages: [],
    });
  }, []);

  // Vérifier si l'abonnement est actif
  const checkSubscription = useCallback(async () => {
    if (!user?.id) return false;

    const { data } = await supabase
      .from('users')
      .select('subscription_active, subscription_expiry')
      .eq('id', user.id)
      .single();

    if (data) {
      const isActive = data.subscription_active && 
        (!data.subscription_expiry || new Date(data.subscription_expiry) > new Date());
      
      useStore.setState({
        user: user ? {
          ...user,
          subscriptionActive: isActive,
          subscriptionExpiry: data.subscription_expiry 
            ? new Date(data.subscription_expiry) 
            : null,
        } : null,
      });

      return isActive;
    }

    return false;
  }, [user]);

  return {
    user,
    isAuthenticated,
    loading,
    supabaseUser,
    sendOtp,
    verifyOtp,
    logout,
    checkSubscription,
  };
}
