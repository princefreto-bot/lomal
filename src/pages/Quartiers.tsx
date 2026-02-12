import { MapPin, ArrowRight } from 'lucide-react';
import { useStore } from '@/store';

const quartiers = [
  { 
    id: '1',
    name: 'Tokoin', 
    description: 'Quartier central avec accès facile aux services et commerces',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600',
    roomCount: 12
  },
  { 
    id: '2',
    name: 'Bè', 
    description: 'Quartier populaire et dynamique, proche du port',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600',
    roomCount: 8
  },
  { 
    id: '3',
    name: 'Adidogomé', 
    description: 'Zone résidentielle calme avec espaces verts',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600',
    roomCount: 15
  },
  { 
    id: '4',
    name: 'Agoè', 
    description: 'Quartier en développement avec logements abordables',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600',
    roomCount: 20
  },
  { 
    id: '5',
    name: 'Agbalépédogan', 
    description: 'Quartier résidentiel moderne et sécurisé',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600',
    roomCount: 10
  },
  { 
    id: '6',
    name: 'Hédzranawoé', 
    description: 'Zone premium avec logements haut standing',
    image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600',
    roomCount: 6
  },
  { 
    id: '7',
    name: 'Nyékonakpoé', 
    description: 'Quartier accessible avec bonne desserte transport',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600',
    roomCount: 14
  },
  { 
    id: '8',
    name: 'Djidjolé', 
    description: 'Zone en expansion avec nouveaux logements',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
    roomCount: 11
  },
  { 
    id: '9',
    name: 'Kodjoviakopé', 
    description: 'Quartier traditionnel avec ambiance familiale',
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600',
    roomCount: 9
  },
  { 
    id: '10',
    name: 'Akodésséwa', 
    description: 'Zone industrielle avec logements économiques',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
    roomCount: 18
  },
  { 
    id: '11',
    name: 'Totsi', 
    description: 'Quartier périphérique calme et abordable',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
    roomCount: 7
  },
  { 
    id: '12',
    name: 'Forever', 
    description: 'Nouveau quartier moderne en plein essor',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
    roomCount: 13
  },
];

export function Quartiers() {
  const { setCurrentPage, rooms } = useStore();

  const getQuartierCount = (name: string) => {
    return rooms.filter(r => r.quartier === name && r.available).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explorez les quartiers de Lomé
            </h1>
            <p className="text-xl text-gray-300">
              Découvrez les différents quartiers et trouvez celui qui correspond à vos besoins
            </p>
          </div>
        </div>
      </section>

      {/* Quartiers Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quartiers.map((quartier) => (
              <button
                key={quartier.id}
                onClick={() => setCurrentPage('rooms')}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all text-left"
              >
                <div className="relative h-40">
                  <img 
                    src={quartier.image} 
                    alt={quartier.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1.5 text-white">
                      <MapPin className="w-4 h-4" />
                      <span className="font-semibold">{quartier.name}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {quartier.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {getQuartierCount(quartier.name) || quartier.roomCount} chambres
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-black group-hover:underline">
                      Voir
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Vous ne trouvez pas votre quartier ?
          </h2>
          <p className="text-gray-600 mb-6">
            Contactez-nous et nous vous aiderons à trouver une chambre dans n'importe quel quartier de Lomé
          </p>
          <button
            onClick={() => setCurrentPage('rooms')}
            className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Voir toutes les chambres
          </button>
        </div>
      </section>
    </div>
  );
}
