import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Configuration du site - modifiable depuis l'admin
interface SiteConfig {
  // Informations de contact
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  
  // Réseaux sociaux
  facebook: string;
  instagram: string;
  tiktok: string;
  twitter: string;
  youtube: string;
  linkedin: string;
  
  // Textes personnalisables
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
}

interface SiteConfigState {
  config: SiteConfig;
  updateConfig: (updates: Partial<SiteConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: SiteConfig = {
  // Contact
  phone: '+228 90 00 00 00',
  email: 'contact@lomal-immobilier.com',
  address: 'Lomé, Togo',
  whatsapp: '22890000000',
  
  // Réseaux sociaux
  facebook: 'https://facebook.com/lomalimmobilier',
  instagram: 'https://instagram.com/lomalimmobilier',
  tiktok: 'https://tiktok.com/@lomalimmobilier',
  twitter: 'https://twitter.com/lomalimmobilier',
  youtube: '',
  linkedin: '',
  
  // Textes
  heroTitle: 'Trouvez votre chambre idéale à Lomé',
  heroSubtitle: 'LOMAL IMMOBILIER vous accompagne dans votre recherche de logement. Accédez à des centaines de chambres vérifiées dans tous les quartiers de Lomé.',
  aboutText: 'Votre partenaire de confiance pour trouver une chambre à Lomé. Service personnalisé et accompagnement jusqu\'à la signature.',
};

export const useSiteConfig = create<SiteConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      
      updateConfig: (updates) => set((state) => ({
        config: { ...state.config, ...updates }
      })),
      
      resetConfig: () => set({ config: defaultConfig }),
    }),
    {
      name: 'lomal-site-config',
    }
  )
);
