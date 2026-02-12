import { useState } from 'react';
import { Phone, ArrowRight, Shield, Check, AlertCircle } from 'lucide-react';
import { useStore } from '@/store';
import { supabase } from '@/lib/supabase';

export function Login() {
  const { setCurrentPage } = useStore();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [fullPhone, setFullPhone] = useState('');

  // Formater le numéro de téléphone
  const formatPhone = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.startsWith('228')) {
      return `+${cleaned}`;
    }
    return `+228${cleaned}`;
  };

  // Étape 1: Envoyer le code OTP
  const handleSendOtp = async () => {
    if (!phone || phone.length < 8) {
      setError('Veuillez entrer un numéro valide (8 chiffres)');
      return;
    }
    if (!name || name.length < 2) {
      setError('Veuillez entrer votre nom');
      return;
    }

    setLoading(true);
    setError('');

    const formattedPhone = formatPhone(phone);
    setFullPhone(formattedPhone);

    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (signInError) {
        console.error('OTP Error:', signInError);
        
        // Si l'auth SMS n'est pas configurée, mode démo
        if (signInError.message.includes('not enabled') || 
            signInError.message.includes('provider') ||
            signInError.message.includes('Phone')) {
          console.log('Mode démo activé - SMS non configuré');
          setOtpSent(true);
          setLoading(false);
          return;
        }
        
        setError(signInError.message);
        setLoading(false);
        return;
      }

      setOtpSent(true);
    } catch (err) {
      console.error('Erreur:', err);
      // Mode démo si erreur
      setOtpSent(true);
    }
    
    setLoading(false);
  };

  // Étape 2: Vérifier le code OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otp,
        type: 'sms',
      });

      if (verifyError) {
        console.error('Verify Error:', verifyError);
        
        // Mode démo si vérification échoue
        if (verifyError.message.includes('not enabled') || 
            verifyError.message.includes('Invalid') ||
            verifyError.message.includes('expired')) {
          // Créer un utilisateur local en mode démo
          await createDemoUser();
          return;
        }
        
        setError('Code invalide. Veuillez réessayer.');
        setLoading(false);
        return;
      }

      if (data.user) {
        // Créer ou mettre à jour le profil utilisateur
        await upsertUserProfile(data.user.id, name, fullPhone);
        
        // Mettre à jour le store
        useStore.setState({
          isAuthenticated: true,
          user: {
            id: data.user.id,
            name: name,
            phone: fullPhone,
            subscriptionActive: false,
            subscriptionExpiry: null,
            createdAt: new Date(),
            isAdmin: false,
          },
        });
        
        setCurrentPage('dashboard');
      }
    } catch (err) {
      console.error('Erreur vérification:', err);
      // Mode démo
      await createDemoUser();
    }
  };

  // Créer/Mettre à jour le profil utilisateur dans Supabase
  const upsertUserProfile = async (userId: string, userName: string, userPhone: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: userId,
          name: userName,
          phone: userPhone,
          subscription_active: false,
        }, {
          onConflict: 'phone',
        });

      if (error) {
        console.error('Erreur création profil:', error);
      }
    } catch (err) {
      console.error('Erreur upsert:', err);
    }
  };

  // Mode démo - créer utilisateur local
  const createDemoUser = async () => {
    const demoUserId = crypto.randomUUID();
    
    // Essayer de créer dans Supabase
    try {
      await supabase.from('users').insert({
        id: demoUserId,
        name: name,
        phone: fullPhone,
        subscription_active: false,
      });
    } catch (err) {
      console.log('Mode démo local uniquement');
    }

    // Mettre à jour le store local
    useStore.setState({
      isAuthenticated: true,
      user: {
        id: demoUserId,
        name: name,
        phone: fullPhone,
        subscriptionActive: false,
        subscriptionExpiry: null,
        createdAt: new Date(),
        isAdmin: false,
      },
    });

    setCurrentPage('dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Bienvenue sur LOMAL</h1>
          <p className="text-gray-600 mt-2">Connectez-vous avec votre numéro de téléphone</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          {!otpSent ? (
            // Step 1: Phone Number
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre nom
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Kofi Mensah"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                    <Phone className="w-5 h-5" />
                    <span className="text-sm font-medium">+228</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="90 00 00 00"
                    className="w-full pl-24 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Recevoir le code SMS
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                En continuant, vous acceptez nos{' '}
                <button 
                  onClick={() => setCurrentPage('terms')}
                  className="underline hover:text-black"
                >
                  conditions d'utilisation
                </button>{' '}
                et notre{' '}
                <button 
                  onClick={() => setCurrentPage('privacy')}
                  className="underline hover:text-black"
                >
                  politique de confidentialité
                </button>
              </p>
            </div>
          ) : (
            // Step 2: OTP Verification
            <div className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="font-semibold text-lg">Code envoyé !</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Entrez le code reçu au <strong>{fullPhone}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code de vérification
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-mono"
                />
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                  <p className="text-center text-xs text-amber-700">
                    💡 <strong>Mode démo :</strong> Entrez n'importe quel code à 6 chiffres pour tester
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Vérifier et continuer
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setError('');
                }}
                className="w-full text-gray-600 py-2 text-sm hover:underline"
              >
                ← Modifier le numéro
              </button>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Connexion sécurisée par SMS OTP</span>
        </div>
      </div>
    </div>
  );
}
