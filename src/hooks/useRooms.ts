import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store';
import type { Room } from '@/types';

export function useRooms() {
  const { rooms, setRooms } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les chambres depuis Supabase
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('available', true)
        .order('score', { ascending: false });

      if (fetchError) {
        console.error('Erreur chargement chambres:', fetchError);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const mappedRooms: Room[] = data.map((room) => ({
          id: room.id,
          title: room.title,
          quartier: room.quartier,
          price: room.price,
          advance: room.advance,
          width: room.width,
          length: room.length,
          surface: room.surface || room.width * room.length,
          conditions: room.conditions || '',
          description: room.description || '',
          images: room.images || [],
          available: room.available,
          featured: room.featured,
          views: room.views || 0,
          clicks: room.clicks || 0,
          score: room.score || 50,
          createdAt: new Date(room.created_at),
        }));

        setRooms(mappedRooms);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion');
    }

    setLoading(false);
  }, [setRooms]);

  // Charger au montage
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Incrémenter les vues
  const incrementViews = useCallback(async (roomId: string) => {
    try {
      await supabase.rpc('increment_room_views', { room_id: roomId });
      useStore.getState().incrementRoomView(roomId);
    } catch (err) {
      console.error('Erreur increment views:', err);
    }
  }, []);

  // Incrémenter les clics
  const incrementClicks = useCallback(async (roomId: string) => {
    try {
      await supabase.rpc('increment_room_clicks', { room_id: roomId });
      useStore.getState().incrementRoomClick(roomId);
    } catch (err) {
      console.error('Erreur increment clicks:', err);
    }
  }, []);

  // Ajouter une chambre (admin)
  const addRoom = useCallback(async (roomData: Omit<Room, 'id' | 'views' | 'clicks' | 'score' | 'createdAt'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('rooms')
        .insert({
          title: roomData.title,
          quartier: roomData.quartier,
          price: roomData.price,
          advance: roomData.advance,
          width: roomData.width,
          length: roomData.length,
          conditions: roomData.conditions,
          description: roomData.description,
          images: roomData.images,
          available: roomData.available,
          featured: roomData.featured,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erreur ajout chambre:', insertError);
        return { success: false, error: insertError.message };
      }

      if (data) {
        const newRoom: Room = {
          id: data.id,
          title: data.title,
          quartier: data.quartier,
          price: data.price,
          advance: data.advance,
          width: data.width,
          length: data.length,
          surface: data.surface || data.width * data.length,
          conditions: data.conditions || '',
          description: data.description || '',
          images: data.images || [],
          available: data.available,
          featured: data.featured,
          views: 0,
          clicks: 0,
          score: 50,
          createdAt: new Date(data.created_at),
        };

        useStore.getState().addRoom(newRoom);
        return { success: true, room: newRoom };
      }

      return { success: false, error: 'Erreur inconnue' };
    } catch (err) {
      console.error('Erreur:', err);
      return { success: false, error: 'Erreur de connexion' };
    }
  }, []);

  // Mettre à jour une chambre (admin)
  const updateRoom = useCallback(async (roomId: string, updates: Partial<Room>) => {
    try {
      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          title: updates.title,
          quartier: updates.quartier,
          price: updates.price,
          advance: updates.advance,
          width: updates.width,
          length: updates.length,
          conditions: updates.conditions,
          description: updates.description,
          images: updates.images,
          available: updates.available,
          featured: updates.featured,
        })
        .eq('id', roomId);

      if (updateError) {
        console.error('Erreur mise à jour:', updateError);
        return { success: false, error: updateError.message };
      }

      useStore.getState().updateRoom(roomId, updates);
      return { success: true };
    } catch (err) {
      console.error('Erreur:', err);
      return { success: false, error: 'Erreur de connexion' };
    }
  }, []);

  // Supprimer une chambre (admin)
  const deleteRoom = useCallback(async (roomId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (deleteError) {
        console.error('Erreur suppression:', deleteError);
        return { success: false, error: deleteError.message };
      }

      useStore.getState().deleteRoom(roomId);
      return { success: true };
    } catch (err) {
      console.error('Erreur:', err);
      return { success: false, error: 'Erreur de connexion' };
    }
  }, []);

  // Obtenir les quartiers uniques
  const getQuartiers = useCallback(() => {
    const quartiersMap = new Map<string, number>();
    
    rooms.forEach((room) => {
      if (room.available) {
        quartiersMap.set(
          room.quartier, 
          (quartiersMap.get(room.quartier) || 0) + 1
        );
      }
    });

    return Array.from(quartiersMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [rooms]);

  // Filtrer les chambres
  const filterRooms = useCallback((filters: {
    quartier?: string;
    minPrice?: number;
    maxPrice?: number;
    minSurface?: number;
  }) => {
    return rooms.filter((room) => {
      if (!room.available) return false;
      if (filters.quartier && room.quartier !== filters.quartier) return false;
      if (filters.minPrice && room.price < filters.minPrice) return false;
      if (filters.maxPrice && room.price > filters.maxPrice) return false;
      if (filters.minSurface && room.surface < filters.minSurface) return false;
      return true;
    });
  }, [rooms]);

  // Chambres en vedette
  const featuredRooms = rooms.filter((r) => r.featured && r.available);

  // Chambres triées par score IA
  const sortedByScore = [...rooms]
    .filter((r) => r.available)
    .sort((a, b) => b.score - a.score);

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    incrementViews,
    incrementClicks,
    addRoom,
    updateRoom,
    deleteRoom,
    getQuartiers,
    filterRooms,
    featuredRooms,
    sortedByScore,
  };
}
