import { useEffect, useState } from 'react';
import { User, CreditCard, MessageCircle, Clock, LogOut, ChevronRight, AlertCircle, Home } from 'lucide-react';
import { useStore } from '@/store';

export function Dashboard() {
  const { user, isAuthenticated, logout, setCurrentPage, messages, toggleChat } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  // Petit délai pour laisser le store se synchroniser
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Non connecté
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Connectez-vous</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à votre tableau de bord</p>
          <div className="space-y-3">
            <button
              onClick={() => setCurrentPage('login')}
              className="w-full bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Se connecter
            </button>
            <button
              onClick={() => setCurrentPage('home')}
              className="w-full flex items-center justify-center gap-2 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  const daysRemaining = user.subscriptionExpiry 
    ? Math.max(0, Math.ceil((new Date(user.subscriptionExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const userMessages = messages.filter(m => !m.isAdmin);

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

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
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                title="Se déconnecter"
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
                    <Home className="w-5 h-5 text-white" />
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
                    <p className="text-sm text-gray-500">
                      {user.subscriptionActive ? 'Renouveler' : 'Souscrire à un abonnement'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {user.subscriptionActive && (
                <button
                  onClick={toggleChat}
                  className="w-full flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-green-700">Contacter le support</p>
                      <p className="text-sm text-green-600">Discutez avec nous pour organiser une visite</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-green-400" />
                </button>
              )}
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
                  onClick={toggleChat}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Ouvrir le chat
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Abonnez-vous pour accéder au chat
                  </p>
                  <button
                    onClick={() => setCurrentPage('subscription')}
                    className="text-sm font-medium text-black hover:underline"
                  >
                    Souscrire →
                  </button>
                </div>
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
                      day: 'numeric',
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
                    href="https://wa.me/22890000000?text=Bonjour%20LOMAL%2C%20j%27ai%20besoin%20d%27aide" 
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

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-blue-800">Comment ça marche ?</h3>
              <ol className="text-sm text-blue-700 mt-2 space-y-1">
                <li>1. Parcourez les chambres disponibles</li>
                <li>2. Abonnez-vous pour 1000 FCFA/semaine</li>
                <li>3. Contactez-nous via le chat pour organiser une visite</li>
                <li>4. Nous vous accompagnons jusqu'au closing avec le propriétaire</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
