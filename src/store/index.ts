import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Room, Message, Payment, Commission } from '@/types';

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  otpSent: boolean;
  otpPhone: string;
  
  // Rooms
  rooms: Room[];
  selectedRoom: Room | null;
  
  // Messages
  messages: Message[];
  unreadCount: number;
  chatOpen: boolean;
  
  // Payments
  payments: Payment[];
  
  // Commissions
  commissions: Commission[];
  
  // UI
  currentPage: string;
  showSubscriptionModal: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  sendOtp: (phone: string) => void;
  verifyOtp: (code: string, name: string) => boolean;
  setRooms: (rooms: Room[]) => void;
  selectRoom: (room: Room | null) => void;
  addRoom: (room: Room) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addMessage: (message: Message) => void;
  markMessagesRead: () => void;
  toggleChat: () => void;
  setCurrentPage: (page: string) => void;
  setShowSubscriptionModal: (show: boolean) => void;
  addPayment: (payment: Payment) => void;
  activateSubscription: () => void;
  addCommission: (commission: Commission) => void;
  incrementRoomView: (id: string) => void;
  incrementRoomClick: (id: string) => void;
}

// Données de démonstration - Quartiers de Lomé
const demoRooms: Room[] = [
  {
    id: '1',
    title: 'Chambre moderne Tokoin',
    quartier: 'Tokoin',
    price: 25000,
    advance: 50000,
    width: 4,
    length: 5,
    surface: 20,
    conditions: 'Célibataire ou couple sans enfant, pas d\'animaux',
    description: 'Belle chambre lumineuse avec carrelage moderne, proche des commodités. Eau et électricité inclus.',
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    available: true,
    featured: true,
    views: 245,
    clicks: 67,
    score: 92,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Studio Bè Klikamé',
    quartier: 'Bè',
    price: 20000,
    advance: 40000,
    width: 3.5,
    length: 4,
    surface: 14,
    conditions: 'Étudiant ou travailleur, calme exigé',
    description: 'Petit studio propre et sécurisé, idéal pour étudiant. Quartier calme.',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    available: true,
    featured: false,
    views: 156,
    clicks: 34,
    score: 78,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    title: 'Grande chambre Adidogomé',
    quartier: 'Adidogomé',
    price: 30000,
    advance: 60000,
    width: 5,
    length: 6,
    surface: 30,
    conditions: 'Famille acceptée, maximum 3 personnes',
    description: 'Spacieuse chambre avec douche interne et WC. Cour commune propre.',
    images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'],
    available: true,
    featured: true,
    views: 312,
    clicks: 89,
    score: 95,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '4',
    title: 'Chambre Agbalépédogan',
    quartier: 'Agbalépédogan',
    price: 22000,
    advance: 44000,
    width: 4,
    length: 4,
    surface: 16,
    conditions: 'Célibataire uniquement',
    description: 'Chambre confortable dans un quartier résidentiel calme. Sécurité 24h.',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
    available: true,
    featured: false,
    views: 98,
    clicks: 23,
    score: 72,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '5',
    title: 'Chambre étudiante Agoè',
    quartier: 'Agoè',
    price: 15000,
    advance: 30000,
    width: 3,
    length: 4,
    surface: 12,
    conditions: 'Étudiant avec garant',
    description: 'Petite chambre économique proche de l\'Université de Lomé.',
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'],
    available: true,
    featured: false,
    views: 421,
    clicks: 112,
    score: 88,
    createdAt: new Date('2024-01-25')
  },
  {
    id: '6',
    title: 'Chambre luxe Hédzranawoé',
    quartier: 'Hédzranawoé',
    price: 45000,
    advance: 90000,
    width: 5,
    length: 6,
    surface: 30,
    conditions: 'Cadre ou expatrié, contrat minimum 6 mois',
    description: 'Chambre haut standing avec climatisation, douche moderne et parking.',
    images: ['https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'],
    available: true,
    featured: true,
    views: 178,
    clicks: 56,
    score: 90,
    createdAt: new Date('2024-02-05')
  },
  {
    id: '7',
    title: 'Chambre Nyékonakpoé',
    quartier: 'Nyékonakpoé',
    price: 18000,
    advance: 36000,
    width: 3.5,
    length: 4.5,
    surface: 15.75,
    conditions: 'Travailleur ou étudiant',
    description: 'Chambre simple et propre, accès facile aux transports.',
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'],
    available: true,
    featured: false,
    views: 134,
    clicks: 29,
    score: 68,
    createdAt: new Date('2024-02-08')
  },
  {
    id: '8',
    title: 'Studio Djidjolé',
    quartier: 'Djidjolé',
    price: 28000,
    advance: 56000,
    width: 4,
    length: 5,
    surface: 20,
    conditions: 'Couple ou célibataire',
    description: 'Studio avec coin cuisine aménagé et balcon. Vue dégagée.',
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
    available: true,
    featured: true,
    views: 267,
    clicks: 78,
    score: 85,
    createdAt: new Date('2024-02-10')
  }
];

const demoPayments: Payment[] = [
  {
    id: 'p1',
    userId: 'u1',
    userName: 'Kofi Mensah',
    userPhone: '+228 90 12 34 56',
    amount: 1000,
    type: 'subscription',
    status: 'success',
    createdAt: new Date('2024-02-01'),
    reference: 'PAY-001-2024'
  },
  {
    id: 'p2',
    userId: 'u2',
    userName: 'Ama Sika',
    userPhone: '+228 91 23 45 67',
    amount: 1000,
    type: 'subscription',
    status: 'success',
    createdAt: new Date('2024-02-05'),
    reference: 'PAY-002-2024'
  },
  {
    id: 'p3',
    userId: 'u3',
    userName: 'Yao Kodjo',
    userPhone: '+228 92 34 56 78',
    amount: 1000,
    type: 'subscription',
    status: 'success',
    createdAt: new Date('2024-02-10'),
    reference: 'PAY-003-2024'
  }
];

const demoCommissions: Commission[] = [
  {
    id: 'c1',
    roomId: '1',
    roomTitle: 'Chambre moderne Tokoin',
    clientId: 'u1',
    clientName: 'Kofi Mensah',
    amount: 25000,
    closedAt: new Date('2024-02-08')
  },
  {
    id: 'c2',
    roomId: '3',
    roomTitle: 'Grande chambre Adidogomé',
    clientId: 'u4',
    clientName: 'Akouvi Dossou',
    amount: 30000,
    closedAt: new Date('2024-02-12')
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      otpSent: false,
      otpPhone: '',
      rooms: demoRooms,
      selectedRoom: null,
      messages: [],
      unreadCount: 0,
      chatOpen: false,
      payments: demoPayments,
      commissions: demoCommissions,
      currentPage: 'home',
      showSubscriptionModal: false,

      // Actions
      setUser: (user) => set({ user }),
      
      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        otpSent: false, 
        otpPhone: '',
        messages: []
      }),
      
      sendOtp: (phone) => set({ otpSent: true, otpPhone: phone }),
      
      verifyOtp: (code, name) => {
        // Simulation: tout code à 6 chiffres est valide
        if (code.length === 6) {
          const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            phone: get().otpPhone,
            createdAt: new Date(),
            subscriptionActive: false,
            subscriptionExpiry: null,
            isAdmin: false
          };
          set({ user: newUser, isAuthenticated: true, otpSent: false });
          return true;
        }
        return false;
      },
      
      setRooms: (rooms) => set({ rooms }),
      
      selectRoom: (room) => set({ selectedRoom: room }),
      
      addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
      
      updateRoom: (id, updates) => set((state) => ({
        rooms: state.rooms.map((r) => r.id === id ? { ...r, ...updates } : r)
      })),
      
      deleteRoom: (id) => set((state) => ({
        rooms: state.rooms.filter((r) => r.id !== id)
      })),
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
        unreadCount: message.isAdmin ? state.unreadCount + 1 : state.unreadCount
      })),
      
      markMessagesRead: () => set({ unreadCount: 0 }),
      
      toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setShowSubscriptionModal: (show) => set({ showSubscriptionModal: show }),
      
      addPayment: (payment) => set((state) => ({
        payments: [...state.payments, payment]
      })),
      
      activateSubscription: () => set((state) => {
        if (state.user) {
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 7);
          return {
            user: {
              ...state.user,
              subscriptionActive: true,
              subscriptionExpiry: expiry
            }
          };
        }
        return {};
      }),
      
      addCommission: (commission) => set((state) => ({
        commissions: [...state.commissions, commission]
      })),
      
      incrementRoomView: (id) => set((state) => ({
        rooms: state.rooms.map((r) => 
          r.id === id ? { ...r, views: r.views + 1 } : r
        )
      })),
      
      incrementRoomClick: (id) => set((state) => ({
        rooms: state.rooms.map((r) => 
          r.id === id ? { ...r, clicks: r.clicks + 1 } : r
        )
      })),
    }),
    {
      name: 'lomal-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        messages: state.messages,
        payments: state.payments,
        commissions: state.commissions,
        rooms: state.rooms
      })
    }
  )
);
