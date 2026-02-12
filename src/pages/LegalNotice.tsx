import { ArrowLeft, Scale, Building, Phone, Mail, Globe } from 'lucide-react';
import { useStore } from '@/store';

export function LegalNotice() {
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
              <Scale className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Mentions Légales</h1>
              <p className="text-gray-300">Dernière mise à jour : Janvier 2025</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          
          {/* Éditeur du site */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-6 h-6 text-black" />
              <h2 className="text-xl font-bold">1. Éditeur du Site</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <p><strong>Dénomination sociale :</strong> LOMAL IMMOBILIER</p>
              <p><strong>Forme juridique :</strong> Société à Responsabilité Limitée Unipersonnelle (SARLU)</p>
              <p><strong>Capital social :</strong> 500 000 FCFA</p>
              <p><strong>Siège social :</strong> Quartier Tokoin, Boulevard du 13 Janvier, Lomé, TOGO</p>
              <p><strong>Numéro RCCM :</strong> TG-LOM-2024-B-12345</p>
              <p><strong>Numéro d'Identification Fiscale (NIF) :</strong> 1234567890</p>
              <p><strong>Directeur de la publication :</strong> M. [Nom du Gérant]</p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-black" />
              <h2 className="text-xl font-bold">2. Contact</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">+228 90 00 00 00</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">contact@lomal.tg</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Site web</p>
                  <p className="font-medium">www.lomal.tg</p>
                </div>
              </div>
            </div>
          </section>

          {/* Hébergeur */}
          <section>
            <h2 className="text-xl font-bold mb-4">3. Hébergement</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-2">
              <p><strong>Hébergeur :</strong> Render Services, Inc.</p>
              <p><strong>Adresse :</strong> 525 Brannan Street, Suite 300, San Francisco, CA 94107, USA</p>
              <p><strong>Site web :</strong> https://render.com</p>
              <p className="text-sm text-gray-600 mt-3">
                Les données sont stockées de manière sécurisée sur des serveurs conformes aux normes internationales de sécurité.
              </p>
            </div>
          </section>

          {/* Activité */}
          <section>
            <h2 className="text-xl font-bold mb-4">4. Nature de l'Activité</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                LOMAL IMMOBILIER est une plateforme de mise en relation entre des personnes recherchant 
                un logement (chambres, studios) à Lomé, Togo, et les propriétaires de ces biens immobiliers.
              </p>
              <p>
                <strong>Notre rôle :</strong> Nous agissons en tant qu'intermédiaire professionnel. 
                Nous ne sommes ni propriétaires ni gestionnaires des biens affichés sur la plateforme. 
                Notre mission est de :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Référencer et vérifier les annonces de chambres disponibles</li>
                <li>Faciliter la recherche de logement pour les utilisateurs</li>
                <li>Organiser les visites entre locataires potentiels et propriétaires</li>
                <li>Accompagner les parties jusqu'à la signature du bail</li>
                <li>Garantir un service professionnel et sécurisé</li>
              </ul>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-xl font-bold mb-4">5. Propriété Intellectuelle</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                L'ensemble du contenu du site LOMAL IMMOBILIER, incluant, de façon non limitative, 
                les textes, graphismes, images, photographies, vidéos, logos, icônes, sons, logiciels, 
                est la propriété exclusive de LOMAL IMMOBILIER ou de ses partenaires, protégé par les 
                lois togolaises et internationales relatives à la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou 
                partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, 
                sauf autorisation écrite préalable de LOMAL IMMOBILIER.
              </p>
              <p>
                Toute exploitation non autorisée du site ou de son contenu sera considérée comme 
                constitutive d'une contrefaçon et poursuivie conformément aux dispositions des 
                articles 425 et suivants du Code de la Propriété Intellectuelle de l'OAPI.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-xl font-bold mb-4">6. Limitation de Responsabilité</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>6.1. Informations sur les annonces :</strong> LOMAL IMMOBILIER s'efforce de 
                vérifier l'exactitude des informations publiées sur les annonces. Toutefois, nous ne 
                pouvons garantir l'exactitude, la complétude ou l'actualité de ces informations. 
                Les photos et descriptions sont fournies à titre indicatif.
              </p>
              <p>
                <strong>6.2. Relations avec les propriétaires :</strong> LOMAL IMMOBILIER n'est pas 
                partie au contrat de location entre le locataire et le propriétaire. Nous déclinons 
                toute responsabilité en cas de litige survenant après la signature du bail.
              </p>
              <p>
                <strong>6.3. Disponibilité du service :</strong> Nous nous efforçons d'assurer la 
                disponibilité du site 24h/24, 7j/7. Cependant, nous ne pouvons garantir une 
                disponibilité continue et déclinons toute responsabilité en cas d'interruption du service.
              </p>
              <p>
                <strong>6.4. Sécurité :</strong> Malgré nos mesures de sécurité, nous ne pouvons 
                garantir une protection absolue contre les cyberattaques. L'utilisateur est responsable 
                de la protection de ses identifiants de connexion.
              </p>
            </div>
          </section>

          {/* Tarification */}
          <section>
            <h2 className="text-xl font-bold mb-4">7. Tarification et Conditions Commerciales</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>7.1. Abonnement :</strong> L'accès complet aux services de LOMAL IMMOBILIER 
                (contact, organisation de visites) nécessite un abonnement hebdomadaire de 
                <strong> 1 000 FCFA</strong>, renouvelable.
              </p>
              <p>
                <strong>7.2. Commission :</strong> En cas de signature d'un contrat de location suite 
                à notre intermédiation, une commission est due à LOMAL IMMOBILIER. Le montant de cette 
                commission est communiqué avant toute visite et correspond généralement à un mois de loyer.
              </p>
              <p>
                <strong>7.3. Paiement :</strong> Les paiements s'effectuent via Mobile Money 
                (T-Money, Flooz) ou par carte bancaire. Les paiements sont sécurisés et chiffrés.
              </p>
              <p>
                <strong>7.4. Remboursement :</strong> Les abonnements ne sont pas remboursables une 
                fois activés, sauf en cas de dysfonctionnement avéré du service imputable à LOMAL IMMOBILIER.
              </p>
            </div>
          </section>

          {/* Litiges */}
          <section>
            <h2 className="text-xl font-bold mb-4">8. Droit Applicable et Juridiction</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Les présentes mentions légales sont régies par le droit togolais. En cas de litige, 
                et après échec de toute tentative de recherche d'une solution amiable, les tribunaux 
                de Lomé seront seuls compétents.
              </p>
              <p>
                Conformément à la réglementation en vigueur, l'utilisateur est informé qu'il peut 
                recourir à une médiation conventionnelle ou à tout mode alternatif de règlement des 
                différends en cas de contestation.
              </p>
            </div>
          </section>

          {/* Modification */}
          <section>
            <h2 className="text-xl font-bold mb-4">9. Modification des Mentions Légales</h2>
            <p className="text-gray-700">
              LOMAL IMMOBILIER se réserve le droit de modifier les présentes mentions légales à tout 
              moment. Les utilisateurs seront informés de toute modification substantielle par email 
              ou notification sur le site. La continuation de l'utilisation du site après modification 
              vaut acceptation des nouvelles conditions.
            </p>
          </section>

          {/* Contact final */}
          <section className="border-t pt-8">
            <div className="bg-black text-white rounded-xl p-6">
              <h3 className="font-bold mb-2">Des questions ?</h3>
              <p className="text-gray-300 mb-4">
                Pour toute question concernant ces mentions légales, contactez-nous :
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="mailto:legal@lomal.tg" 
                  className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  legal@lomal.tg
                </a>
                <a 
                  href="https://wa.me/22890000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} LOMAL IMMOBILIER. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
