// Types principaux LOMAL IMMOBILIER

export interface User {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
  subscriptionActive: boolean;
  subscriptionExpiry: Date | null;
  isAdmin?: boolean;
}

export interface Room {
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
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderPhone?: string;
  content: string;
  timestamp: Date;
  isAdmin: boolean;
  read: boolean;
  conversationId: string;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  type: 'subscription' | 'commission';
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
  reference: string;
}

export interface Commission {
  id: string;
  roomId: string;
  roomTitle: string;
  clientId: string;
  clientName: string;
  amount: number;
  closedAt: Date;
}

export interface Analytics {
  totalRevenue: number;
  subscriptionRevenue: number;
  commissionRevenue: number;
  activeUsers: number;
  totalPayments: number;
  conversionRate: number;
}

export interface Quartier {
  id: string;
  name: string;
  description: string;
  image: string;
  roomCount: number;
}
