import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Lock } from 'lucide-react';
import { useStore } from '@/store';

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    user, 
    isAuthenticated, 
    messages, 
    addMessage,
    setCurrentPage 
  } = useStore();

  const hasActiveSubscription = user?.subscriptionActive ?? false;

  // Filtrer les messages de l'utilisateur connecté
  const userMessages = messages.filter(
    m => m.conversationId === user?.id
  );

  // Scroll automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userMessages]);

  const handleSend = () => {
    if (!message.trim() || !user) return;

    addMessage({
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderPhone: user.phone,
      content: message.trim(),
      timestamp: new Date(),
      isAdmin: false,
      read: false,
      conversationId: user.id,
    });

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6" />
        {userMessages.filter(m => m.isAdmin && !m.read).length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {userMessages.filter(m => m.isAdmin && !m.read).length}
          </span>
        )}
      </button>

      {/* Popup Chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold">L</span>
              </div>
              <div>
                <p className="font-semibold">Support LOMAL</p>
                <p className="text-xs text-gray-300">
                  {hasActiveSubscription ? 'En ligne • Répond rapidement' : 'Abonnement requis'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenu */}
          {!isAuthenticated ? (
            // Non connecté
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Connectez-vous</h3>
              <p className="text-gray-500 text-sm mb-4">
                Connectez-vous pour accéder au chat support.
              </p>
              <button
                onClick={() => { setCurrentPage('login'); setIsOpen(false); }}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium"
              >
                Se connecter
              </button>
            </div>
          ) : !hasActiveSubscription ? (
            // Pas d'abonnement
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Abonnement requis</h3>
              <p className="text-gray-500 text-sm mb-4">
                Activez votre abonnement pour contacter notre équipe et organiser des visites.
              </p>
              <button
                onClick={() => { setCurrentPage('subscription'); setIsOpen(false); }}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium"
              >
                S'abonner • 1 000 F/semaine
              </button>
            </div>
          ) : (
            // Chat actif
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {/* Message de bienvenue */}
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">L</span>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%] shadow-sm">
                    <p className="text-sm">
                      Bonjour {user?.name} ! 👋 Je suis là pour vous aider à trouver votre chambre idéale à Lomé. Comment puis-je vous aider ?
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Support LOMAL</p>
                  </div>
                </div>

                {userMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.isAdmin ? '' : 'flex-row-reverse'}`}
                  >
                    {msg.isAdmin && (
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">L</span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                        msg.isAdmin
                          ? 'bg-white rounded-tl-none shadow-sm'
                          : 'bg-black text-white rounded-tr-none'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.isAdmin ? 'text-gray-400' : 'text-gray-300'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                        {msg.isAdmin && ' • Support LOMAL'}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
