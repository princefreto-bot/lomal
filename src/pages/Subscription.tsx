import { useState, useEffect } from 'react';
import { Check, Shield, Smartphone, CreditCard, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/store';
import { 
  createPaydunyaInvoice, 
  simulateMobileMoneyPayment, 
  formatCFA,
  getPaymentMethodInfo,
  type PaydunyaInvoice 
} from '@/lib/paydunya';

const benefits = [
  'Accès illimité aux contacts LOMAL',
  'Organisation de visites personnalisées',
  'Accompagnement jusqu\'à la signature',
  'Négociation avec les propriétaires',
  'Support WhatsApp prioritaire',
  'Alertes nouvelles annonces',
];

type PaymentStep = 'select' | 'details' | 'processing' | 'otp' | 'success' | 'error';
type PaymentMethod = 'tmoney' | 'flooz' | 'card';

export function Subscription() {
  const { user, activateSubscription, addPayment, setCurrentPage, isAuthenticated } = useStore();
  
  const [step, setStep] = useState<PaymentStep>('select');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tmoney');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [invoice, setInvoice] = useState<PaydunyaInvoice | null>(null);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');

  // Countdown pour le code OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Redirection si non connecté
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Connectez-vous d'abord</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour vous abonner</p>
          <button
            onClick={() => setCurrentPage('login')}
            className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Déjà abonné
  if (user?.subscriptionActive && step === 'select') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Vous êtes déjà abonné !</h2>
          <p className="text-gray-600 mb-6">
            Votre accès LOMAL IMMOBILIER est actif jusqu'au :
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xl font-bold">
              {user.subscriptionExpiry?.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('rooms')}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Voir les chambres
          </button>
        </div>
      </div>
    );
  }

  // Créer la facture et passer au paiement
  const handleStartPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      setError('Veuillez entrer un numéro valide');
      return;
    }

    setError('');
    setStep('processing');
    setProcessingMessage('Création de la facture...');

    try {
      const response = await createPaydunyaInvoice({
        amount: 1000,
        description: 'Abonnement LOMAL IMMOBILIER - 7 jours',
        customerName: user!.name,
        customerPhone: phoneNumber,
        paymentMethod,
        metadata: {
          userId: user!.id,
          type: 'subscription',
        },
      });

      if (response.success && response.invoice) {
        setInvoice(response.invoice);
        setProcessingMessage('Envoi de la demande de paiement...');
        
        // Simulation: attendre puis passer à l'étape OTP
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStep('otp');
        setCountdown(120); // 2 minutes pour entrer le code
      } else {
        setError(response.error || 'Erreur lors de la création du paiement');
        setStep('error');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setStep('error');
    }
  };

  // Confirmer le paiement avec OTP
  const handleConfirmPayment = async () => {
    if (otpCode.length < 4) {
      setError('Veuillez entrer le code reçu');
      return;
    }

    setError('');
    setStep('processing');
    setProcessingMessage('Vérification du paiement...');

    try {
      const response = await simulateMobileMoneyPayment(invoice!.reference, otpCode);

      if (response.success) {
        setProcessingMessage('Activation de votre abonnement...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Enregistrer le paiement
        const payment = {
          id: invoice!.id,
          userId: user!.id,
          userName: user!.name,
          userPhone: phoneNumber,
          amount: 1000,
          type: 'subscription' as const,
          status: 'success' as const,
          createdAt: new Date(),
          reference: invoice!.reference,
        };

        addPayment(payment);
        activateSubscription();
        setStep('success');
      } else {
        setError(response.error || 'Le paiement a échoué');
        setStep('error');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setStep('error');
    }
  };

  // Reset pour réessayer
  const handleRetry = () => {
    setStep('details');
    setError('');
    setOtpCode('');
    setInvoice(null);
  };

  // Page de succès
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Paiement réussi ! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Votre abonnement LOMAL IMMOBILIER est maintenant actif.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Référence</span>
              <span className="font-mono text-sm">{invoice?.reference}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Montant</span>
              <span className="font-semibold">{formatCFA(1000)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Méthode</span>
              <span>{getPaymentMethodInfo(paymentMethod).name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Expire le</span>
              <span className="font-semibold">
                {user?.subscriptionExpiry?.toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setCurrentPage('rooms')}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Découvrir les chambres
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Mon tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Page d'erreur
  if (step === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Paiement échoué</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Réessayer
            </button>
            <button
              onClick={() => setStep('select')}
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Page de traitement
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-gray-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold mb-2">Traitement en cours...</h2>
          <p className="text-gray-600">{processingMessage}</p>
          
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-700">
              ⚠️ Ne fermez pas cette page pendant le traitement
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Page OTP (confirmation Mobile Money)
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setStep('details')}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: getPaymentMethodInfo(paymentMethod).color + '20' }}
              >
                <Smartphone 
                  className="w-8 h-8" 
                  style={{ color: getPaymentMethodInfo(paymentMethod).color }}
                />
              </div>
              <h2 className="text-xl font-bold mb-2">Confirmez votre paiement</h2>
              <p className="text-gray-600">
                Un code de confirmation a été envoyé au<br />
                <span className="font-semibold">+228 {phoneNumber}</span>
              </p>
            </div>

            {/* Simulation Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-700 text-center">
                🧪 <strong>Mode Simulation</strong><br />
                Entrez n'importe quel code à 4 chiffres (ex: 1234)
              </p>
            </div>

            {/* Code Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code de confirmation
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                className="w-full px-4 py-4 text-2xl text-center tracking-[0.5em] font-mono border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                maxLength={6}
              />
            </div>

            {/* Countdown */}
            {countdown > 0 && (
              <p className="text-center text-sm text-gray-500 mb-6">
                Code valide pendant {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </p>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Montant</span>
                <span className="font-semibold">{formatCFA(1000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Référence</span>
                <span className="font-mono text-xs">{invoice?.reference}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={otpCode.length < 4}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmer le paiement
            </button>

            <button
              onClick={() => setCountdown(120)}
              disabled={countdown > 0}
              className="w-full text-center text-sm text-gray-500 mt-4 hover:text-black disabled:opacity-50"
            >
              Renvoyer le code
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Page détails paiement
  if (step === 'details') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setStep('select')}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Détails du paiement</h2>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Méthode de paiement
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'tmoney', name: 'T-Money', icon: Smartphone, color: '#00A651' },
                  { id: 'flooz', name: 'Flooz', icon: Smartphone, color: '#0066B3' },
                  { id: 'card', name: 'Carte', icon: CreditCard, color: '#1A1A1A' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id 
                        ? 'border-black bg-gray-50 scale-105' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <method.icon 
                      className="w-6 h-6 mx-auto mb-2" 
                      style={{ color: paymentMethod === method.id ? method.color : '#9CA3AF' }}
                    />
                    <p className={`text-sm font-medium ${
                      paymentMethod === method.id ? 'text-black' : 'text-gray-500'
                    }`}>
                      {method.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro {paymentMethod === 'tmoney' ? 'T-Money' : paymentMethod === 'flooz' ? 'Flooz' : 'de téléphone'}
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500">
                  +228
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 8));
                    setError('');
                  }}
                  placeholder="90 00 00 00"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Abonnement 7 jours</span>
                <span>{formatCFA(1000)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Frais de service</span>
                <span className="text-green-600">Gratuit</span>
              </div>
              <div className="flex justify-between font-bold pt-3 border-t border-gray-200">
                <span>Total à payer</span>
                <span>{formatCFA(1000)}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Shield className="w-4 h-4" />
              <span>Paiement sécurisé par PayDunya</span>
            </div>

            <button
              onClick={handleStartPayment}
              disabled={phoneNumber.length < 8}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Payer {formatCFA(1000)}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              En continuant, vous acceptez nos conditions générales
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Page de sélection (défaut)
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Abonnement LOMAL
          </h1>
          <p className="text-xl text-gray-600">
            Accédez à tous nos services pour trouver votre chambre idéale
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border-2 border-black relative overflow-hidden">
            {/* Badge */}
            <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
              POPULAIRE
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold">Accès Premium</h3>
              <p className="text-gray-600">Durée: 7 jours</p>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold">1000</span>
              <span className="text-gray-500 text-lg">FCFA / semaine</span>
            </div>

            <div className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('details')}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              S'abonner maintenant
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
              <Shield className="w-4 h-4" />
              <span>Paiement sécurisé Mobile Money</span>
            </div>
          </div>

          {/* How it works */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Comment ça marche ?</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Abonnez-vous', desc: 'Payez 1000 FCFA via T-Money ou Flooz' },
                  { step: 2, title: 'Contactez-nous', desc: 'Envoyez-nous les chambres qui vous intéressent' },
                  { step: 3, title: 'Visitez', desc: 'Nous organisons les visites pour vous' },
                  { step: 4, title: 'Signez', desc: 'Nous vous accompagnons jusqu\'au closing' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accepted Payment Methods */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Moyens de paiement acceptés</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold text-lg">T</span>
                  </div>
                  <p className="text-sm font-medium">T-Money</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold text-lg">F</span>
                  </div>
                  <p className="text-sm font-medium">Flooz</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="text-sm font-medium">Carte</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Questions fréquentes</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">Y a-t-il d'autres frais ?</p>
                  <p className="text-gray-600 mt-1">
                    Une commission est prise uniquement lors de la signature du bail.
                  </p>
                </div>
                <div>
                  <p className="font-medium">L'abonnement est-il remboursable ?</p>
                  <p className="text-gray-600 mt-1">
                    Non, mais nous garantissons un accompagnement jusqu'à la location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
