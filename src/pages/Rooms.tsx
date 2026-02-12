import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, MapPin, Maximize2, Star, TrendingUp } from 'lucide-react';
import { useStore } from '@/store';

const quartiersFilter = [
  'Tous', 'Tokoin', 'Bè', 'Adidogomé', 'Agoè', 'Agbalépédogan', 
  'Hédzranawoé', 'Nyékonakpoé', 'Djidjolé'
];

const priceRanges = [
  { label: 'Tous les prix', min: 0, max: Infinity },
  { label: 'Moins de 20 000', min: 0, max: 20000 },
  { label: '20 000 - 30 000', min: 20000, max: 30000 },
  { label: '30 000 - 50 000', min: 30000, max: 50000 },
  { label: 'Plus de 50 000', min: 50000, max: Infinity },
];

// Algorithme IA de recommandation simple
function calculateRecommendationScore(room: any, _userPrefs: any): number {
  let score = room.score || 50;
  
  // Boost basé sur les vues et clics
  score += Math.min(room.views / 10, 20);
  score += Math.min(room.clicks * 2, 15);
  
  // Boost si featured
  if (room.featured) score += 10;
  
  // Pénalité si pas disponible
  if (!room.available) score -= 50;
  
  // Normaliser entre 0 et 100
  return Math.max(0, Math.min(100, score));
}

export function Rooms() {
  const { rooms, setCurrentPage, selectRoom, incrementRoomView, user } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuartier, setSelectedQuartier] = useState('Tous');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'newest'>('recommended');

  // Filtrer et trier les chambres avec IA
  const filteredRooms = useMemo(() => {
    let result = rooms.filter(room => {
      // Filtre disponibilité
      if (!room.available) return false;
      
      // Filtre recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!room.title.toLowerCase().includes(query) && 
            !room.quartier.toLowerCase().includes(query) &&
            !room.description.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // Filtre quartier
      if (selectedQuartier !== 'Tous' && room.quartier !== selectedQuartier) {
        return false;
      }
      
      // Filtre prix
      const priceRange = priceRanges[selectedPriceRange];
      if (room.price < priceRange.min || room.price > priceRange.max) {
        return false;
      }
      
      return true;
    });

    // Calculer score IA pour chaque chambre
    result = result.map(room => ({
      ...room,
      aiScore: calculateRecommendationScore(room, { user })
    }));

    // Trier
    switch (sortBy) {
      case 'recommended':
        result.sort((a, b) => (b as any).aiScore - (a as any).aiScore);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [rooms, searchQuery, selectedQuartier, selectedPriceRange, sortBy, user]);

  const handleRoomClick = (room: any) => {
    incrementRoomView(room.id);
    selectRoom(room);
    setCurrentPage('room-detail');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par quartier, titre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-xl flex items-center gap-2 transition-colors ${
                showFilters ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filtres</h3>
                <button 
                  onClick={() => {
                    setSelectedQuartier('Tous');
                    setSelectedPriceRange(0);
                    setSortBy('recommended');
                  }}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Réinitialiser
                </button>
              </div>
              
              {/* Quartiers */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Quartier</p>
                <div className="flex flex-wrap gap-2">
                  {quartiersFilter.map((q) => (
                    <button
                      key={q}
                      onClick={() => setSelectedQuartier(q)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedQuartier === q 
                          ? 'bg-black text-white' 
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Budget mensuel</p>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPriceRange(index)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedPriceRange === index 
                          ? 'bg-black text-white' 
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tri */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Trier par</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="recommended">🤖 Recommandé pour vous</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="newest">Plus récentes</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              <span className="font-semibold text-black">{filteredRooms.length}</span> chambres trouvées
              {selectedQuartier !== 'Tous' && <span> à {selectedQuartier}</span>}
            </p>
            {sortBy === 'recommended' && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4" />
                Tri intelligent IA
              </div>
            )}
          </div>

          {/* Rooms Grid */}
          {filteredRooms.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRooms.map((room, index) => (
                <button
                  key={room.id}
                  onClick={() => handleRoomClick(room)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all text-left group"
                >
                  <div className="relative h-44">
                    <img 
                      src={room.images[0]} 
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {room.featured && (
                      <div className="absolute top-3 left-3 bg-black text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        À la une
                      </div>
                    )}
                    {sortBy === 'recommended' && index < 3 && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                        Top {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {room.quartier}
                    </div>
                    <h3 className="font-semibold mb-1.5 line-clamp-1 group-hover:text-gray-600">
                      {room.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5" />
                        {room.surface} m²
                      </span>
                      <span>{room.width}m × {room.length}m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold">
                        {room.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">F/mois</span>
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucune chambre trouvée</h3>
              <p className="text-gray-600 mb-4">
                Essayez de modifier vos critères de recherche
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedQuartier('Tous');
                  setSelectedPriceRange(0);
                }}
                className="text-black font-medium hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
