import { User, CreditCard, MessageCircle, Clock, LogOut, ChevronRight, AlertCircle } from 'lucide-react';
import { useStore } from '@/store';

export function Dashboard() {
  const { user, isAuthenticated, logout, setCurrentPage, messages } = useStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connectez-vous</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à votre compte</p>
          <button
            onClick={() => setCurrentPage('login')}
            className="bg-black text-white px-6 py-3 rounded-xl font-medium"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = user.subscriptionExpiry 
    ? Math.max(0, Math.ceil((new Date(user.subscriptionExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const userMessages = messages.filter(m => !m.isAdmin);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Mon compte</h1>
          <p className="text-gray-600">Gérez votre profil et votre abonnement</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-600">{user.phone}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Subscription Status */}
            <div className={`rounded-xl p-4 ${user.subscriptionActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Statut abonnement</p>
                  {user.subscriptionActive ? (
                    <>
                      <p className="font-semibold text-green-700">✓ Actif</p>
                      <p className="text-sm text-green-600">
                        Expire dans {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-700">Inactif</p>
                      <p className="text-sm text-gray-500">Abonnez-vous pour contacter LOMAL</p>
                    </>
                  )}
                </div>
                {!user.subscriptionActive && (
                  <button
                    onClick={() => setCurrentPage('subscription')}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    S'abonner
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setCurrentPage('rooms')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Voir les chambres</p>
                    <p className="text-sm text-gray-500">Parcourez nos annonces</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={() => setCurrentPage('subscription')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Abonnement</p>
                    <p className="text-sm text-gray-500">Gérer votre abonnement</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Messages */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Messages</p>
                  <p className="text-sm text-gray-500">{userMessages.length} envoyés</p>
                </div>
              </div>
              {user.subscriptionActive ? (
                <button
                  onClick={() => useStore.getState().toggleChat()}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Ouvrir le chat
                </button>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  Abonnez-vous pour accéder au chat
                </p>
              )}
            </div>

            {/* Member Since */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Membre depuis</p>
                  <p className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Besoin d'aide ?</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Contactez-nous sur WhatsApp pour toute question.
                  </p>
                  <a 
                    href="https://wa.me/22890000000" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm font-medium text-black hover:underline"
                  >
                    Ouvrir WhatsApp →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
