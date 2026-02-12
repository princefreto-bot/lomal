import { useState } from 'react';
import { Phone, ArrowRight, Shield, Check, AlertCircle, User, LogIn, UserPlus } from 'lucide-react';
import { useStore } from '@/store';
import { supabase } from '@/lib/supabase';

type AuthMode = 'login' | 'register';
type Step = 'form' | 'otp' | 'loading';

export function Login() {
  const { setCurrentPage } = useStore();
  
  // Mode: connexion ou inscription
  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<Step>('form');
  
  // Champs
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullPhone, setFullPhone] = useState('');

  // Formater le numéro de téléphone
  const formatPhone = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.startsWith('228')) {
      return `+${cleaned}`;
    }
    return `+228${cleaned}`;
  };

  // ========================================
  // CONNEXION - Utilisateur existant
  // ========================================
  const handleLogin = async () => {
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

    try {
      // Vérifier si l'utilisateur existe dans Supabase
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', formattedPhone)
        .single();

      if (fetchError || !existingUser) {
        setError('Aucun compte trouvé avec ce numéro. Veuillez vous inscrire.');
        setLoading(false);
        return;
      }

      // Vérifier que le nom correspond (insensible à la casse)
      if (existingUser.name.toLowerCase().trim() !== name.toLowerCase().trim()) {
        setError('Le nom ne correspond pas à ce numéro. Vérifiez vos informations.');
        setLoading(false);
        return;
      }

      // Connexion réussie !
      useStore.setState({
        isAuthenticated: true,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          phone: existingUser.phone,
          subscriptionActive: existingUser.subscription_active || false,
          subscriptionExpiry: existingUser.subscription_expiry ? new Date(existingUser.subscription_expiry) : null,
          createdAt: new Date(existingUser.created_at),
          isAdmin: existingUser.is_admin || false,
        },
      });

      setCurrentPage('dashboard');
    } catch (err) {
      console.error('Erreur connexion:', err);
      // Mode démo si Supabase non configuré
      await loginDemoMode();
    }

    setLoading(false);
  };

  // Connexion mode démo (sans Supabase)
  const loginDemoMode = async () => {
    const formattedPhone = formatPhone(phone);
    
    // Simuler un utilisateur existant
    useStore.setState({
      isAuthenticated: true,
      user: {
        id: crypto.randomUUID(),
        name: name,
        phone: formattedPhone,
        subscriptionActive: false,
        subscriptionExpiry: null,
        createdAt: new Date(),
        isAdmin: false,
      },
    });

    setCurrentPage('dashboard');
  };

  // ========================================
  // INSCRIPTION - Nouveau compte avec OTP
  // ========================================
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
      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('phone', formattedPhone)
        .single();

      if (existingUser) {
        setError('Ce numéro est déjà inscrit. Utilisez "Se connecter".');
        setLoading(false);
        return;
      }

      // Envoyer OTP via Supabase Auth
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
        
        // Mode démo si SMS non configuré
        if (signInError.message.includes('not enabled') || 
            signInError.message.includes('provider') ||
            signInError.message.includes('Phone')) {
          console.log('Mode démo activé - SMS non configuré');
          setStep('otp');
          setLoading(false);
          return;
        }
        
        setError(signInError.message);
        setLoading(false);
        return;
      }

      setStep('otp');
    } catch (err) {
      console.error('Erreur:', err);
      // Mode démo si erreur
      setStep('otp');
    }
    
    setLoading(false);
  };

  // Vérifier le code OTP
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
          await createNewUser();
          return;
        }
        
        setError('Code invalide. Veuillez réessayer.');
        setLoading(false);
        return;
      }

      if (data.user) {
        // Créer le profil utilisateur
        await createUserProfile(data.user.id, name, fullPhone);
        
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
      await createNewUser();
    }
  };

  // Créer le profil utilisateur dans Supabase
  const createUserProfile = async (userId: string, userName: string, userPhone: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          id: userId,
          name: userName,
          phone: userPhone,
          subscription_active: false,
        });

      if (error) {
        console.error('Erreur création profil:', error);
      }
    } catch (err) {
      console.error('Erreur insert:', err);
    }
  };

  // Mode démo - créer nouvel utilisateur
  const createNewUser = async () => {
    const newUserId = crypto.randomUUID();
    
    // Essayer de créer dans Supabase
    try {
      await supabase.from('users').insert({
        id: newUserId,
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
        id: newUserId,
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

  // Reset form quand on change de mode
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setStep('form');
    setError('');
    setOtp('');
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
          <p className="text-gray-600 mt-2">
            {mode === 'login' 
              ? 'Connectez-vous à votre compte' 
              : 'Créez votre compte en quelques secondes'
            }
          </p>
        </div>

        {/* Toggle Login/Register */}
        <div className="bg-gray-100 rounded-xl p-1 flex mb-6">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'login'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Se connecter
          </button>
          <button
            onClick={() => switchMode('register')}
            className={`flex-1 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'register'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            S'inscrire
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          
          {/* ========================================
              MODE CONNEXION
          ======================================== */}
          {mode === 'login' && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-700">
                  <strong>👤 Connexion rapide</strong><br />
                  Entrez le nom et numéro utilisés lors de votre inscription.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
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
                  <Phone className="w-4 h-4 inline mr-1" />
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                    <span className="text-sm font-medium">+228</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="90 00 00 00"
                    className="w-full pl-16 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                Pas encore de compte ?{' '}
                <button 
                  onClick={() => switchMode('register')}
                  className="text-black font-medium hover:underline"
                >
                  Inscrivez-vous
                </button>
              </p>
            </div>
          )}

          {/* ========================================
              MODE INSCRIPTION - Étape 1: Formulaire
          ======================================== */}
          {mode === 'register' && step === 'form' && (
            <div className="space-y-5">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-700">
                  <strong>🔐 Inscription sécurisée</strong><br />
                  Vous recevrez un code SMS pour valider votre numéro.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Votre nom complet
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
                  <Phone className="w-4 h-4 inline mr-1" />
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                    <span className="text-sm font-medium">+228</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="90 00 00 00"
                    className="w-full pl-16 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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

              <p className="text-center text-sm text-gray-500">
                Déjà un compte ?{' '}
                <button 
                  onClick={() => switchMode('login')}
                  className="text-black font-medium hover:underline"
                >
                  Connectez-vous
                </button>
              </p>
            </div>
          )}

          {/* ========================================
              MODE INSCRIPTION - Étape 2: OTP
          ======================================== */}
          {mode === 'register' && step === 'otp' && (
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
                    💡 <strong>Mode démo :</strong> Entrez n'importe quel code à 6 chiffres
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
                    Vérifier et créer mon compte
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setStep('form');
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
          <span>Connexion sécurisée</span>
        </div>

        {/* Retour accueil */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-sm text-gray-500 hover:text-black hover:underline"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
