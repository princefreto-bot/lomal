import { useState, useRef } from 'react';
import { 
  LayoutDashboard, Home, Users, CreditCard, MessageCircle, 
  TrendingUp, Plus, Edit, Trash2, Eye, EyeOff, X,
  DollarSign, Calendar, BarChart3, ArrowUpRight, ArrowDownRight,
  Send, Upload, Image as ImageIcon, Phone
} from 'lucide-react';
import { useStore } from '@/store';
import { supabase } from '@/lib/supabase';
import type { Room, Message } from '@/types';

type AdminTab = 'dashboard' | 'rooms' | 'users' | 'payments' | 'commissions' | 'messages';

export function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  const { rooms, payments, commissions, messages, addRoom, updateRoom, deleteRoom, addMessage } = useStore();

  // Calculs Analytics
  const totalSubscriptionRevenue = payments
    .filter(p => p.type === 'subscription' && p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalCommissionRevenue = commissions.reduce((sum, c) => sum + c.amount, 0);
  const totalRevenue = totalSubscriptionRevenue + totalCommissionRevenue;
  
  const activeUsers = payments.filter(p => p.type === 'subscription' && p.status === 'success').length;
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.available).length;

  // KPI Calculs
  const thisMonth = new Date().getMonth();
  const thisMonthRevenue = payments
    .filter(p => new Date(p.createdAt).getMonth() === thisMonth && p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0) + 
    commissions
    .filter(c => new Date(c.closedAt).getMonth() === thisMonth)
    .reduce((sum, c) => sum + c.amount, 0);

  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthRevenue = payments
    .filter(p => new Date(p.createdAt).getMonth() === lastMonth && p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0) +
    commissions
    .filter(c => new Date(c.closedAt).getMonth() === lastMonth)
    .reduce((sum, c) => sum + c.amount, 0);

  const revenueGrowth = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
    : 0;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms', label: 'Chambres', icon: Home },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'commissions', label: 'Commissions', icon: DollarSign },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-black text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold">L</span>
            </div>
            <div>
              <p className="font-bold">LOMAL IMMOBILIER</p>
              <p className="text-xs text-gray-400">Administration</p>
            </div>
          </div>
          <button 
            onClick={() => useStore.getState().setCurrentPage('home')}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Retour au site
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'messages' && messages.filter(m => !m.isAdmin && !m.read).length > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {messages.filter(m => !m.isAdmin && !m.read).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className={`flex items-center gap-1 text-sm ${Number(revenueGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(revenueGrowth) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {revenueGrowth}%
                  </span>
                </div>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} F</p>
                <p className="text-sm text-gray-500">Revenus totaux</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{activeUsers}</p>
                <p className="text-sm text-gray-500">Utilisateurs actifs</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Home className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{availableRooms}/{totalRooms}</p>
                <p className="text-sm text-gray-500">Chambres disponibles</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{commissions.length}</p>
                <p className="text-sm text-gray-500">Closings réussis</p>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Répartition revenus
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Abonnements</span>
                      <span className="font-medium">{totalSubscriptionRevenue.toLocaleString()} F</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full" 
                        style={{ width: `${totalRevenue > 0 ? (totalSubscriptionRevenue / totalRevenue * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Commissions</span>
                      <span className="font-medium">{totalCommissionRevenue.toLocaleString()} F</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full" 
                        style={{ width: `${totalRevenue > 0 ? (totalCommissionRevenue / totalRevenue * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Revenus ce mois
                </h3>
                <p className="text-4xl font-bold text-green-600">{thisMonthRevenue.toLocaleString()} F</p>
                <p className="text-sm text-gray-500 mt-2">
                  vs {lastMonthRevenue.toLocaleString()} F le mois dernier
                </p>
              </div>
            </div>

            {/* Top Rooms */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold mb-4">Chambres les plus vues</h3>
              <div className="space-y-3">
                {rooms
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((room, index) => (
                    <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{room.title}</p>
                          <p className="text-xs text-gray-500">{room.quartier}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{room.views} vues</p>
                        <p className="text-xs text-gray-500">{room.clicks} clics</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Gestion des chambres</h2>
              <button
                onClick={() => { setEditingRoom(null); setShowRoomModal(true); }}
                className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chambre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quartier</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={room.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <p className="font-medium text-sm">{room.title}</p>
                              <p className="text-xs text-gray-500">{room.surface} m²</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{room.quartier}</td>
                        <td className="px-4 py-3 text-sm font-medium">{room.price.toLocaleString()} F</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {room.views} vues · {room.clicks} clics
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            room.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {room.available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {room.available ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditingRoom(room); setShowRoomModal(true); }}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateRoom(room.id, { available: !room.available })}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              {room.available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => deleteRoom(room.id)}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Utilisateurs</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscription</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paiements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments
                      .filter(p => p.type === 'subscription')
                      .map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{payment.userName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{payment.userPhone}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              {payment.amount} F
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Historique des paiements</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono">{payment.reference}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-sm">{payment.userName}</p>
                          <p className="text-xs text-gray-500">{payment.userPhone}</p>
                        </td>
                        <td className="px-4 py-3 font-medium">{payment.amount.toLocaleString()} F</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.type === 'subscription' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {payment.type === 'subscription' ? 'Abonnement' : 'Commission'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'success' ? 'bg-green-100 text-green-700' : 
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {payment.status === 'success' ? 'Réussi' : payment.status === 'pending' ? 'En cours' : 'Échoué'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Commissions Tab */}
        {activeTab === 'commissions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Commissions</h2>
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
                Total: {totalCommissionRevenue.toLocaleString()} F
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chambre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date closing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {commissions.map((commission) => (
                      <tr key={commission.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{commission.roomTitle}</td>
                        <td className="px-4 py-3 text-sm">{commission.clientName}</td>
                        <td className="px-4 py-3 font-medium text-green-600">{commission.amount.toLocaleString()} F</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(commission.closedAt).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab - AMÉLIORÉ */}
        {activeTab === 'messages' && (
          <AdminMessages messages={messages} addMessage={addMessage} />
        )}

        {/* Room Modal */}
        {showRoomModal && (
          <RoomModal 
            room={editingRoom}
            onClose={() => setShowRoomModal(false)}
            onSave={(room) => {
              if (editingRoom) {
                updateRoom(editingRoom.id, room);
              } else {
                addRoom({ ...room, id: `room-${Date.now()}` } as Room);
              }
              setShowRoomModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Composant Messages Admin - Tu vois les noms/numéros des clients et tu peux répondre
function AdminMessages({ messages, addMessage }: { messages: Message[], addMessage: (msg: Message) => void }) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Grouper les messages par conversation (par utilisateur)
  const conversations = messages.reduce((acc, msg) => {
    const convId = msg.conversationId;
    if (!acc[convId]) {
      acc[convId] = {
        id: convId,
        clientName: msg.isAdmin ? '' : msg.senderName,
        clientPhone: msg.isAdmin ? '' : (msg.senderPhone || ''),
        messages: [],
        lastMessage: msg,
        unreadCount: 0,
      };
    }
    acc[convId].messages.push(msg);
    if (!msg.isAdmin && !msg.read) {
      acc[convId].unreadCount++;
    }
    // Garder le nom/phone du client (pas de l'admin)
    if (!msg.isAdmin) {
      acc[convId].clientName = msg.senderName;
      acc[convId].clientPhone = msg.senderPhone;
    }
    // Dernier message
    if (new Date(msg.timestamp) > new Date(acc[convId].lastMessage.timestamp)) {
      acc[convId].lastMessage = msg;
    }
    return acc;
  }, {} as Record<string, { id: string; clientName: string; clientPhone?: string; messages: Message[]; lastMessage: Message; unreadCount: number }>);

  const conversationList = Object.values(conversations).sort(
    (a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  );

  const selectedConv = selectedConversation ? conversations[selectedConversation] : null;

  // Envoyer une réponse
  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;

    const adminMessage: Message = {
      id: `msg-admin-${Date.now()}`,
      senderId: 'admin',
      senderName: 'LOMAL Support',
      content: replyText.trim(),
      timestamp: new Date(),
      isAdmin: true,
      read: false,
      conversationId: selectedConversation,
    };

    addMessage(adminMessage);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Messages clients</h2>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-3 h-[600px]">
          {/* Liste des conversations */}
          <div className="border-r border-gray-100 overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-500">Conversations</h3>
            </div>
            {conversationList.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aucun message</p>
              </div>
            ) : (
              conversationList.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selectedConversation === conv.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-semibold text-sm">{conv.clientName || 'Client'}</p>
                      {conv.clientPhone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {conv.clientPhone}
                        </p>
                      )}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {conv.lastMessage.isAdmin ? 'Vous: ' : ''}{conv.lastMessage.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(conv.lastMessage.timestamp).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Conversation sélectionnée */}
          <div className="md:col-span-2 flex flex-col">
            {selectedConv ? (
              <>
                {/* Header conversation */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{selectedConv.clientName}</p>
                      {selectedConv.clientPhone && (
                        <a 
                          href={`tel:${selectedConv.clientPhone}`}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {selectedConv.clientPhone}
                        </a>
                      )}
                    </div>
                    <a
                      href={`https://wa.me/${selectedConv.clientPhone?.replace(/\s/g, '').replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {selectedConv.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          msg.isAdmin
                            ? 'bg-black text-white rounded-tr-none'
                            : 'bg-white shadow-sm rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.isAdmin ? 'text-gray-300' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input réponse */}
                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                      placeholder="Répondre au client..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Sélectionnez une conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Room Modal Component avec Upload d'images
function RoomModal({ 
  room, 
  onClose, 
  onSave 
}: { 
  room: Room | null; 
  onClose: () => void; 
  onSave: (room: Partial<Room>) => void;
}) {
  const [formData, setFormData] = useState({
    title: room?.title || '',
    quartier: room?.quartier || '',
    price: room?.price || 0,
    advance: room?.advance || 0,
    width: room?.width || 0,
    length: room?.length || 0,
    description: room?.description || '',
    conditions: room?.conditions || '',
    images: room?.images || [],
    available: room?.available ?? true,
    featured: room?.featured ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload d'image vers Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [...formData.images];

    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `rooms/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('room-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Erreur upload:', uploadError);
          // Mode démo - utiliser URL locale
          const localUrl = URL.createObjectURL(file);
          newImages.push(localUrl);
        } else {
          // Récupérer l'URL publique
          const { data } = supabase.storage
            .from('room-images')
            .getPublicUrl(filePath);
          
          newImages.push(data.publicUrl);
        }
      } catch (err) {
        console.error('Erreur:', err);
        // Mode démo
        const localUrl = URL.createObjectURL(file);
        newImages.push(localUrl);
      }
    }

    setFormData({ ...formData, images: newImages });
    setUploading(false);
  };

  // Supprimer une image
  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      surface: formData.width * formData.length,
      views: room?.views || 0,
      clicks: room?.clicks || 0,
      score: room?.score || 50,
      createdAt: room?.createdAt || new Date(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-lg">{room ? 'Modifier' : 'Ajouter'} une chambre</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Upload Images */}
          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {formData.images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {/* Bouton ajouter image */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-black transition-colors"
              >
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Ajouter</span>
                  </>
                )}
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {/* Ou URL manuelle */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ou coller une URL d'image..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    if (input.value) {
                      setFormData({ ...formData, images: [...formData.images, input.value] });
                      input.value = '';
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="URL"]') as HTMLInputElement;
                  if (input?.value) {
                    setFormData({ ...formData, images: [...formData.images, input.value] });
                    input.value = '';
                  }
                }}
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Quartier</label>
            <input
              type="text"
              value={formData.quartier}
              onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prix mensuel (FCFA)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Avance (FCFA)</label>
              <input
                type="number"
                value={formData.advance}
                onChange={(e) => setFormData({ ...formData, advance: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Largeur (m)</label>
              <input
                type="number"
                step="0.1"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longueur (m)</label>
              <input
                type="number"
                step="0.1"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Conditions</label>
            <input
              type="text"
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Disponible</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">À la une</span>
            </label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border rounded-lg font-medium hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800"
            >
              {room ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
