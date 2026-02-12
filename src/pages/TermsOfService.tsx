import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Ban, CreditCard, MessageSquare } from 'lucide-react';
import { useStore } from '@/store';

export function TermsOfService() {
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
              <FileText className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Conditions Générales d'Utilisation</h1>
              <p className="text-gray-300">Dernière mise à jour : Janvier 2025</p>
            </div>
          </div>
          <p className="text-gray-300 mt-4">
            Veuillez lire attentivement ces conditions avant d'utiliser LOMAL IMMOBILIER. 
            En accédant à notre plateforme, vous acceptez ces conditions dans leur intégralité.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          
          {/* Article 1 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Article 1 - Objet
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir 
                les modalités et conditions d'utilisation des services proposés par LOMAL IMMOBILIER, 
                ainsi que de définir les droits et obligations des parties dans ce cadre.
              </p>
              <p>
                LOMAL IMMOBILIER est une plateforme de mise en relation entre des particuliers 
                recherchant un logement (chambres, studios) à Lomé et les propriétaires de ces biens.
              </p>
            </div>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Article 2 - Acceptation des Conditions
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                L'utilisation de la plateforme LOMAL IMMOBILIER implique l'acceptation pleine et 
                entière des présentes CGU. L'utilisateur reconnaît avoir pris connaissance des 
                présentes conditions et les accepte expressément.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important :</strong> Si vous n'acceptez pas ces conditions, 
                  veuillez ne pas utiliser nos services.
                </p>
              </div>
            </div>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="text-xl font-bold mb-4">Article 3 - Description des Services</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>3.1 Services gratuits :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Consultation des annonces de chambres</li>
                <li>Recherche par quartier, prix et critères</li>
                <li>Visualisation des photos et descriptions</li>
                <li>Création d'un compte utilisateur</li>
              </ul>
              
              <p><strong>3.2 Services payants (abonnement) :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Accès au contact direct avec l'équipe LOMAL</li>
                <li>Organisation de visites personnalisées</li>
                <li>Accompagnement dans les négociations</li>
                <li>Support prioritaire via chat et WhatsApp</li>
                <li>Alertes sur les nouvelles annonces</li>
              </ul>
              
              <p><strong>3.3 Commission closing :</strong></p>
              <p className="ml-4">
                En cas de signature d'un contrat de location suite à notre intermédiation, 
                une commission équivalente à un mois de loyer est due à LOMAL IMMOBILIER.
              </p>
            </div>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="text-xl font-bold mb-4">Article 4 - Inscription et Compte</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>4.1 Création de compte :</strong></p>
              <p>
                Pour accéder aux services complets, l'utilisateur doit créer un compte en 
                fournissant son nom et numéro de téléphone. L'authentification se fait par 
                code SMS (OTP).
              </p>
              
              <p><strong>4.2 Exactitude des informations :</strong></p>
              <p>
                L'utilisateur s'engage à fournir des informations exactes et à jour. 
                Toute fausse déclaration pourra entraîner la suspension du compte.
              </p>
              
              <p><strong>4.3 Sécurité du compte :</strong></p>
              <p>
                L'utilisateur est responsable de la confidentialité de ses codes de connexion. 
                Toute utilisation du compte est présumée faite par le titulaire.
              </p>
            </div>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Article 5 - Tarification et Paiement
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold mb-3">5.1 Abonnement hebdomadaire</h4>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">1 000 FCFA</span>
                  <span className="text-gray-500">/ semaine</span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  <li>• Durée : 7 jours à compter du paiement</li>
                  <li>• Non remboursable après activation</li>
                  <li>• Renouvellement manuel</li>
                </ul>
              </div>
              
              <p><strong>5.2 Moyens de paiement acceptés :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>T-Money (Togocel)</li>
                <li>Flooz (Moov Africa)</li>
                <li>Carte bancaire (Visa, Mastercard)</li>
              </ul>
              
              <p><strong>5.3 Commission de closing :</strong></p>
              <p>
                Un mois de loyer est dû à LOMAL IMMOBILIER en cas de signature effective 
                d'un bail suite à notre intermédiation. Cette commission est payable avant 
                la remise des clés.
              </p>
              
              <p><strong>5.4 Politique de remboursement :</strong></p>
              <p>
                Les abonnements ne sont pas remboursables sauf en cas de dysfonctionnement 
                technique avéré imputable à LOMAL IMMOBILIER.
              </p>
            </div>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Ban className="w-5 h-5" />
              Article 6 - Obligations et Interdictions
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>6.1 L'utilisateur s'engage à :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Utiliser la plateforme conformément à sa destination</li>
                <li>Respecter les droits des autres utilisateurs et propriétaires</li>
                <li>Fournir des informations véridiques</li>
                <li>Honorer ses engagements de visite</li>
                <li>Payer les commissions dues en cas de closing</li>
              </ul>
              
              <p><strong>6.2 Il est formellement interdit de :</strong></p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                <p className="flex items-center gap-2 text-red-800">
                  <Ban className="w-4 h-4" />
                  Contacter directement les propriétaires en contournant LOMAL
                </p>
                <p className="flex items-center gap-2 text-red-800">
                  <Ban className="w-4 h-4" />
                  Utiliser les informations des annonces à des fins commerciales
                </p>
                <p className="flex items-center gap-2 text-red-800">
                  <Ban className="w-4 h-4" />
                  Créer plusieurs comptes pour une même personne
                </p>
                <p className="flex items-center gap-2 text-red-800">
                  <Ban className="w-4 h-4" />
                  Publier des contenus illicites, diffamatoires ou inappropriés
                </p>
                <p className="flex items-center gap-2 text-red-800">
                  <Ban className="w-4 h-4" />
                  Tenter de pirater ou compromettre la sécurité du site
                </p>
              </div>
            </div>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="text-xl font-bold mb-4">Article 7 - Rôle de LOMAL IMMOBILIER</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>7.1 Intermédiaire :</strong></p>
              <p>
                LOMAL IMMOBILIER agit exclusivement en qualité d'intermédiaire entre les 
                chercheurs de logement et les propriétaires. Nous ne sommes pas partie au 
                contrat de location.
              </p>
              
              <p><strong>7.2 Vérification des annonces :</strong></p>
              <p>
                Nous nous efforçons de vérifier l'authenticité des annonces publiées. 
                Cependant, nous ne pouvons garantir l'exactitude de toutes les informations 
                fournies par les propriétaires.
              </p>
              
              <p><strong>7.3 Non-responsabilité :</strong></p>
              <p>
                LOMAL IMMOBILIER ne peut être tenu responsable des litiges survenant entre 
                locataires et propriétaires après la signature du bail.
              </p>
            </div>
          </section>

          {/* Article 8 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Article 8 - Communication et Support
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>8.1 Chat intégré :</strong></p>
              <p>
                Les abonnés ont accès à un chat pour communiquer avec l'équipe LOMAL. 
                Les conversations sont conservées pour améliorer notre service.
              </p>
              
              <p><strong>8.2 Notifications WhatsApp :</strong></p>
              <p>
                En vous inscrivant, vous acceptez de recevoir des notifications par WhatsApp 
                concernant vos visites et votre compte.
              </p>
              
              <p><strong>8.3 Délais de réponse :</strong></p>
              <p>
                Nous nous engageons à répondre aux messages dans un délai de 24 heures 
                ouvrables pour les abonnés.
              </p>
            </div>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Article 9 - Sanctions
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                En cas de non-respect des présentes CGU, LOMAL IMMOBILIER se réserve le droit de :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Suspendre temporairement l'accès au compte</li>
                <li>Résilier définitivement le compte sans remboursement</li>
                <li>Refuser toute future inscription</li>
                <li>Engager des poursuites judiciaires si nécessaire</li>
              </ul>
            </div>
          </section>

          {/* Article 10 */}
          <section>
            <h2 className="text-xl font-bold mb-4">Article 10 - Propriété Intellectuelle</h2>
            <p className="text-gray-700">
              L'ensemble des éléments de la plateforme (logo, design, textes, images, code) 
              sont la propriété exclusive de LOMAL IMMOBILIER et sont protégés par les lois 
              relatives à la propriété intellectuelle. Toute reproduction non autorisée est interdite.
            </p>
          </section>

          {/* Article 11 */}
          <section>
            <h2 className="text-xl font-bold mb-4">Article 11 - Modification des CGU</h2>
            <p className="text-gray-700">
              LOMAL IMMOBILIER se réserve le droit de modifier les présentes CGU à tout moment. 
              Les utilisateurs seront informés par email ou notification au moins 15 jours avant 
              l'entrée en vigueur des modifications. La poursuite de l'utilisation après cette 
              date vaut acceptation des nouvelles conditions.
            </p>
          </section>

          {/* Article 12 */}
          <section>
            <h2 className="text-xl font-bold mb-4">Article 12 - Droit Applicable et Juridiction</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Les présentes CGU sont régies par le droit togolais. En cas de litige, les parties 
                s'engagent à rechercher une solution amiable. À défaut, les tribunaux de Lomé 
                seront seuls compétents.
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm">
                  <strong>Médiation :</strong> Avant toute action judiciaire, l'utilisateur peut 
                  saisir le médiateur de la consommation compétent au Togo.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t pt-8">
            <div className="bg-black text-white rounded-xl p-6">
              <h3 className="font-bold mb-2">Questions sur ces conditions ?</h3>
              <p className="text-gray-300 mb-4">
                Contactez notre service juridique :
              </p>
              <p className="text-sm">
                <strong>Email :</strong> legal@lomal.tg<br />
                <strong>Téléphone :</strong> +228 90 00 00 00<br />
                <strong>Adresse :</strong> Quartier Tokoin, Lomé, TOGO
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} LOMAL IMMOBILIER. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
