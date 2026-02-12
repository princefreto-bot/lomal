import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useStore } from '@/store';

// Configuration des réseaux sociaux et contacts - À MODIFIER selon vos informations
const CONFIG = {
  // Contacts
  phone: '+228 90 00 00 00',
  email: 'contact@lomal-immobilier.com',
  address: 'Lomé, Togo',
  whatsapp: '+22890000000', // Sans espaces ni +
  
  // Réseaux sociaux - Mettez vos vrais liens
  socialLinks: {
    facebook: 'https://facebook.com/lomalimmobilier',
    instagram: 'https://instagram.com/lomalimmobilier',
    tiktok: 'https://tiktok.com/@lomalimmobilier',
    twitter: 'https://twitter.com/lomalimmobilier',
  }
};

export function Footer() {
  const { setCurrentPage } = useStore();

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl">LOMAL IMMOBILIER</span>
            </div>
            <p className="text-gray-400 text-sm">
              Votre partenaire de confiance pour trouver une chambre à Lomé. 
              Service personnalisé et accompagnement jusqu'à la signature.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="hover:text-white transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('quartiers')}
                  className="hover:text-white transition-colors"
                >
                  Quartiers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('rooms')}
                  className="hover:text-white transition-colors"
                >
                  Chambres
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('subscription')}
                  className="hover:text-white transition-colors"
                >
                  Abonnement
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{CONFIG.address}</span>
              </li>
              <li>
                <a 
                  href={`tel:${CONFIG.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{CONFIG.phone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${CONFIG.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{CONFIG.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex gap-3 flex-wrap">
              {/* Facebook */}
              <a 
                href={CONFIG.socialLinks.facebook}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              
              {/* Instagram */}
              <a 
                href={CONFIG.socialLinks.instagram}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              
              {/* TikTok */}
              <a 
                href={CONFIG.socialLinks.tiktok}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                title="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              
              {/* Twitter/X */}
              <a 
                href={CONFIG.socialLinks.twitter}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                title="Twitter / X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            
            {/* WhatsApp */}
            <a 
              href={`https://wa.me/${CONFIG.whatsapp}?text=Bonjour LOMAL IMMOBILIER, je cherche une chambre à Lomé.`}
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Écrivez-nous sur WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} LOMAL IMMOBILIER. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <button 
                onClick={() => setCurrentPage('legal')}
                className="hover:text-white transition-colors"
              >
                Mentions légales
              </button>
              <button 
                onClick={() => setCurrentPage('privacy')}
                className="hover:text-white transition-colors"
              >
                Politique de confidentialité
              </button>
              <button 
                onClick={() => setCurrentPage('terms')}
                className="hover:text-white transition-colors"
              >
                CGU
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
