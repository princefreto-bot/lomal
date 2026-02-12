import { Search, Shield, Clock, Users, ArrowRight, Star, MapPin } from 'lucide-react';
import { useStore } from '@/store';

const quartiers = [
  { name: 'Tokoin', count: 12, image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400' },
  { name: 'Bè', count: 8, image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400' },
  { name: 'Adidogomé', count: 15, image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400' },
  { name: 'Agoè', count: 20, image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400' },
];

const features = [
  {
    icon: Search,
    title: 'Recherche facile',
    description: 'Trouvez rapidement une chambre selon votre quartier et budget'
  },
  {
    icon: Shield,
    title: 'Service sécurisé',
    description: 'Nous vérifions chaque annonce et accompagnons vos visites'
  },
  {
    icon: Clock,
    title: 'Réponse rapide',
    description: 'Accès direct à notre équipe pour organiser vos visites'
  },
  {
    icon: Users,
    title: 'Accompagnement',
    description: 'Nous négocions pour vous jusqu\'à la signature du bail'
  }
];

export function Home() {
  const { setCurrentPage, rooms, isAuthenticated } = useStore();
  
  const featuredRooms = rooms.filter(r => r.featured && r.available).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Trouvez votre chambre idéale à <span className="text-gray-300">Lomé</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              LOMAL IMMOBILIER vous accompagne dans votre recherche de logement. 
              Accédez à des centaines de chambres vérifiées dans tous les quartiers de Lomé.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentPage('rooms')}
                className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Voir les chambres
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage('quartiers')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Explorer par quartier
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <p className="text-4xl font-bold">{rooms.length}+</p>
                <p className="text-gray-400">Chambres disponibles</p>
              </div>
              <div>
                <p className="text-4xl font-bold">15+</p>
                <p className="text-gray-400">Quartiers couverts</p>
              </div>
              <div>
                <p className="text-4xl font-bold">500+</p>
                <p className="text-gray-400">Clients satisfaits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi LOMAL IMMOBILIER ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un service complet pour vous aider à trouver le logement parfait
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quartiers Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Quartiers populaires</h2>
              <p className="text-gray-600">Explorez les meilleurs quartiers de Lomé</p>
            </div>
            <button
              onClick={() => setCurrentPage('quartiers')}
              className="hidden sm:flex items-center gap-2 text-black font-medium hover:underline"
            >
              Voir tous
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quartiers.map((quartier) => (
              <button
                key={quartier.name}
                onClick={() => setCurrentPage('rooms')}
                className="group relative h-48 rounded-2xl overflow-hidden"
              >
                <img 
                  src={quartier.image} 
                  alt={quartier.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-lg">{quartier.name}</h3>
                  <p className="text-sm text-gray-300">{quartier.count} chambres</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Chambres à la une</h2>
              <p className="text-gray-600">Nos meilleures opportunités du moment</p>
            </div>
            <button
              onClick={() => setCurrentPage('rooms')}
              className="hidden sm:flex items-center gap-2 text-black font-medium hover:underline"
            >
              Toutes les chambres
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img 
                    src={room.images[0]} 
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    À la une
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    {room.quartier}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{room.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{room.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA/mois</span></p>
                    </div>
                    <button
                      onClick={() => {
                        useStore.getState().selectRoom(room);
                        setCurrentPage('room-detail');
                      }}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Voir détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Accédez à toutes les annonces
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Pour seulement <span className="font-bold text-white">1000 FCFA par semaine</span>, 
            contactez-nous directement et organisez vos visites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => isAuthenticated ? setCurrentPage('subscription') : setCurrentPage('login')}
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              {isAuthenticated ? 'S\'abonner maintenant' : 'Créer un compte'}
            </button>
            <button
              onClick={() => setCurrentPage('rooms')}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Découvrir d'abord
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
