import { X, Lock, ArrowRight } from 'lucide-react';
import { useStore } from '@/store';

export function SubscriptionModal() {
  const { showSubscriptionModal, setShowSubscriptionModal, setCurrentPage, isAuthenticated } = useStore();

  if (!showSubscriptionModal) return null;

  const handleSubscribe = () => {
    setShowSubscriptionModal(false);
    if (isAuthenticated) {
      setCurrentPage('subscription');
    } else {
      setCurrentPage('login');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="relative bg-black text-white p-6 text-center">
          <button
            onClick={() => setShowSubscriptionModal(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Accès Premium Requis</h2>
          <p className="text-gray-300 text-sm">
            Abonnez-vous pour contacter LOMAL et organiser vos visites
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price */}
          <div className="text-center mb-6">
            <p className="text-4xl font-bold">1000 <span className="text-lg font-normal text-gray-500">FCFA</span></p>
            <p className="text-gray-500">par semaine</p>
          </div>

          {/* Benefits */}
          <ul className="space-y-3 mb-6">
            {[
              'Contactez notre équipe directement',
              'Organisez des visites personnalisées',
              'Accompagnement jusqu\'à la signature',
              'Support WhatsApp prioritaire',
            ].map((benefit, index) => (
              <li key={index} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={handleSubscribe}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            {isAuthenticated ? 'S\'abonner maintenant' : 'Se connecter'}
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Paiement sécurisé via Mobile Money (T-Money, Flooz)
          </p>
        </div>
      </div>
    </div>
  );
}
