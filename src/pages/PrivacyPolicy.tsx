import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Bell, Trash2, Globe } from 'lucide-react';
import { useStore } from '@/store';

export function PrivacyPolicy() {
  const { setCurrentPage } = useStore();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </button>

        {/* Header */}
        <div className="bg-black text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Politique de Confidentialité</h1>
              <p className="text-gray-300">Dernière mise à jour : Janvier 2025</p>
            </div>
          </div>
          <p className="text-gray-300 mt-4">
            Chez LOMAL IMMOBILIER, la protection de vos données personnelles est une priorité absolue. 
            Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Lock className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium">Données chiffrées</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <UserCheck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">Consentement requis</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Eye className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium">Transparence totale</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Trash2 className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <p className="text-sm font-medium">Droit à l'oubli</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">1</span>
              Introduction
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                La présente Politique de Confidentialité s'applique au site web et à l'application mobile 
                LOMAL IMMOBILIER, exploités par la société LOMAL IMMOBILIER SARLU, immatriculée au RCCM 
                de Lomé sous le numéro TG-LOM-2024-B-12345.
              </p>
              <p>
                En utilisant nos services, vous acceptez les pratiques décrites dans cette politique. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
              </p>
              <p>
                Cette politique est conforme à la loi togolaise n°2019-014 relative à la protection 
                des données à caractère personnel et s'inspire des meilleures pratiques internationales, 
                notamment le RGPD européen.
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">2</span>
              Données Collectées
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  2.1 Données d'identification
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Nom complet :</strong> Pour vous identifier et personnaliser nos services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Numéro de téléphone :</strong> Identifiant principal pour la connexion OTP et les notifications</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  2.2 Données d'utilisation
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Historique de navigation :</strong> Pages visitées, chambres consultées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Préférences :</strong> Quartiers favoris, fourchette de budget</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Messages :</strong> Conversations avec notre équipe support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Données de paiement :</strong> Historique des transactions (les données bancaires ne sont jamais stockées)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  2.3 Données techniques
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Adresse IP :</strong> Pour la sécurité et la détection de fraude</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Type d'appareil :</strong> Mobile, tablette ou ordinateur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Navigateur :</strong> Version et type pour optimiser l'affichage</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Utilisation des données */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">3</span>
              Utilisation des Données
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Nous utilisons vos données personnelles uniquement pour les finalités suivantes :</p>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">🏠 Fourniture du service</h4>
                  <p className="text-sm">Recherche de chambres, organisation de visites, mise en relation avec les propriétaires.</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">🔐 Authentification</h4>
                  <p className="text-sm">Vérification de votre identité via SMS OTP, sécurisation de votre compte.</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">💳 Paiements</h4>
                  <p className="text-sm">Traitement de vos abonnements et commissions via Mobile Money.</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">🤖 Personnalisation IA</h4>
                  <p className="text-sm">Recommandations intelligentes de chambres basées sur vos préférences.</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">📱 Notifications</h4>
                  <p className="text-sm">Alertes WhatsApp/SMS pour les nouvelles annonces et mises à jour.</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">📊 Amélioration</h4>
                  <p className="text-sm">Analyse anonymisée pour améliorer nos services.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Partage des données */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">4</span>
              Partage des Données
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>LOMAL IMMOBILIER ne vend jamais vos données personnelles.</strong></p>
              
              <p>Vos données peuvent être partagées uniquement avec :</p>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🏢</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Propriétaires</h4>
                    <p className="text-sm text-gray-600">Uniquement votre nom et téléphone, après votre accord explicite pour organiser une visite.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💳</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Prestataires de paiement</h4>
                    <p className="text-sm text-gray-600">PayDunya, CinetPay pour le traitement sécurisé des paiements Mobile Money.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Services de notification</h4>
                    <p className="text-sm text-gray-600">Twilio/Meta pour l'envoi des SMS OTP et notifications WhatsApp.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">☁️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Hébergeur</h4>
                    <p className="text-sm text-gray-600">Supabase (PostgreSQL) pour le stockage sécurisé des données.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">⚖️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Autorités légales</h4>
                    <p className="text-sm text-gray-600">Uniquement sur demande légale formelle des autorités togolaises compétentes.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">5</span>
              Sécurité des Données
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Nous mettons en œuvre des mesures de sécurité robustes pour protéger vos données :</p>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Lock className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Chiffrement SSL/TLS (HTTPS)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Authentification OTP sécurisée</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Database className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Base de données chiffrée (AES-256)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Eye className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Monitoring et détection d'intrusions</span>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important :</strong> Malgré nos mesures, aucun système n'est infaillible. 
                  Ne partagez jamais votre code OTP avec quiconque, y compris notre équipe.
                </p>
              </div>
            </div>
          </section>

          {/* Conservation */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">6</span>
              Durée de Conservation
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold">Type de données</th>
                    <th className="px-4 py-3 text-left font-semibold">Durée de conservation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3">Données de compte</td>
                    <td className="px-4 py-3">Jusqu'à suppression du compte + 1 an</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Messages de chat</td>
                    <td className="px-4 py-3">2 ans après le dernier message</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Données de paiement</td>
                    <td className="px-4 py-3">10 ans (obligation légale)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Logs techniques</td>
                    <td className="px-4 py-3">1 an</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Données de navigation</td>
                    <td className="px-4 py-3">13 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Droits */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">7</span>
              Vos Droits
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Conformément à la loi togolaise sur la protection des données, vous disposez des droits suivants :</p>
              
              <div className="space-y-3">
                <div className="border-l-4 border-black pl-4 py-2">
                  <h4 className="font-semibold">Droit d'accès</h4>
                  <p className="text-sm text-gray-600">Obtenir une copie de toutes les données que nous détenons sur vous.</p>
                </div>
                <div className="border-l-4 border-black pl-4 py-2">
                  <h4 className="font-semibold">Droit de rectification</h4>
                  <p className="text-sm text-gray-600">Corriger toute information inexacte ou incomplète.</p>
                </div>
                <div className="border-l-4 border-black pl-4 py-2">
                  <h4 className="font-semibold">Droit à l'effacement ("droit à l'oubli")</h4>
                  <p className="text-sm text-gray-600">Demander la suppression de vos données personnelles.</p>
                </div>
                <div className="border-l-4 border-black pl-4 py-2">
                  <h4 className="font-semibold">Droit à la portabilité</h4>
                  <p className="text-sm text-gray-600">Recevoir vos données dans un format structuré et lisible.</p>
                </div>
                <div className="border-l-4 border-black pl-4 py-2">
                  <h4 className="font-semibold">Droit d'opposition</h4>
                  <p className="text-sm text-gray-600">Vous opposer au traitement de vos données à des fins marketing.</p>
                </div>
                <div className="border-l-4 border-black pl-4 py-2">
                  <h4 className="font-semibold">Droit de retrait du consentement</h4>
                  <p className="text-sm text-gray-600">Retirer votre consentement à tout moment pour les traitements basés sur celui-ci.</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mt-4">
                <p className="text-sm">
                  <strong>Pour exercer vos droits :</strong> Envoyez un email à{' '}
                  <a href="mailto:privacy@lomal.tg" className="text-black font-medium underline">privacy@lomal.tg</a>{' '}
                  avec une copie de votre pièce d'identité. Nous répondrons sous 30 jours maximum.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">8</span>
              Cookies et Technologies Similaires
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Nous utilisons des cookies et le stockage local pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Cookies essentiels :</strong> Maintenir votre session connectée</li>
                <li><strong>Cookies de préférence :</strong> Mémoriser vos choix (quartiers, filtres)</li>
                <li><strong>Cookies analytiques :</strong> Comprendre comment vous utilisez le site (anonymisé)</li>
              </ul>
              <p className="text-sm text-gray-600">
                Vous pouvez gérer les cookies dans les paramètres de votre navigateur. 
                La désactivation de certains cookies peut affecter le fonctionnement du site.
              </p>
            </div>
          </section>

          {/* Notifications WhatsApp */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">9</span>
              Notifications WhatsApp
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                En vous inscrivant, vous acceptez de recevoir des notifications WhatsApp pour :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Confirmation d'inscription</li>
                <li>Confirmation de paiement d'abonnement</li>
                <li>Rappels de visites planifiées</li>
                <li>Réponses de notre équipe support</li>
                <li>Alertes sur les nouvelles annonces correspondant à vos critères</li>
              </ul>
              <p className="text-sm text-gray-600">
                Vous pouvez vous désabonner à tout moment en répondant "STOP" à n'importe quel message 
                ou en modifiant vos préférences dans votre espace personnel.
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">10</span>
              Modifications de cette Politique
            </h2>
            <p className="text-gray-700">
              Nous pouvons mettre à jour cette politique de confidentialité périodiquement. 
              En cas de modification substantielle, nous vous informerons par email ou notification 
              dans l'application au moins 30 jours avant l'entrée en vigueur des changements.
            </p>
          </section>

          {/* Contact DPO */}
          <section className="border-t pt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Délégué à la Protection des Données (DPO)
            </h2>
            <div className="bg-black text-white rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                Pour toute question relative à vos données personnelles, contactez notre DPO :
              </p>
              <div className="space-y-2">
                <p><strong>Email :</strong> dpo@lomal.tg</p>
                <p><strong>Téléphone :</strong> +228 90 00 00 00</p>
                <p><strong>Adresse :</strong> LOMAL IMMOBILIER, Quartier Tokoin, Lomé, TOGO</p>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Vous avez également le droit de déposer une plainte auprès de l'ILPDP 
                (Instance de Protection des Données Personnelles du Togo).
              </p>
            </div>
          </section>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} LOMAL IMMOBILIER. Votre confiance est notre priorité.
        </p>
      </div>
    </div>
  );
}
