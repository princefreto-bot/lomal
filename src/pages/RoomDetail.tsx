import { useState } from 'react';
import { 
  ArrowLeft, MapPin, ChevronLeft, ChevronRight, 
  Lock, Check, MessageCircle, Star, Eye
} from 'lucide-react';
import { useStore } from '@/store';

export function RoomDetail() {
  const { 
    selectedRoom, setCurrentPage, user, isAuthenticated, 
    incrementRoomClick, setShowSubscriptionModal, toggleChat 
  } = useStore();
  const [currentImage, setCurrentImage] = useState(0);

  if (!selectedRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Aucune chambre sélectionnée</p>
          <button
            onClick={() => setCurrentPage('rooms')}
            className="text-black font-medium hover:underline"
          >
            Voir les chambres
          </button>
        </div>
      </div>
    );
  }

  const room = selectedRoom;
  const hasSubscription = user?.subscriptionActive;

  const handleContact = () => {
    if (!isAuthenticated) {
      setCurrentPage('login');
      return;
    }
    
    if (!hasSubscription) {
      setShowSubscriptionModal(true);
      return;
    }

    incrementRoomClick(room.id);
    toggleChat();
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => setCurrentPage('rooms')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux chambres
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-72 sm:h-96">
                <img 
                  src={room.images[currentImage]} 
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
                
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {room.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImage ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {room.featured && (
                    <span className="bg-black text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                      <Star className="w-4 h-4" />
                      À la une
                    </span>
                  )}
                  <span className="bg-white/90 text-gray-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {room.views} vues
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {room.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {room.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImage ? 'border-black' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{room.quartier}, Lomé</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">{room.title}</h1>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">{room.surface}</p>
                  <p className="text-sm text-gray-500">m² surface</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">{room.width}</p>
                  <p className="text-sm text-gray-500">m largeur</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">{room.length}</p>
                  <p className="text-sm text-gray-500">m longueur</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">{(room.advance / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-gray-500">FCFA avance</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{room.description}</p>
              </div>

              {/* Conditions */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Conditions</h3>
                <p className="text-gray-600">{room.conditions}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Contact */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-32">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Prix mensuel</p>
                <p className="text-4xl font-bold">
                  {room.price.toLocaleString()} <span className="text-lg font-normal text-gray-500">FCFA</span>
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Avance requise</span>
                  <span className="font-medium">{room.advance.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Surface</span>
                  <span className="font-medium">{room.surface} m²</span>
                </div>
              </div>

              {/* Contact Button */}
              {hasSubscription ? (
                <div className="space-y-3">
                  <button
                    onClick={handleContact}
                    className="w-full bg-black text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contacter LOMAL
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    <Check className="w-4 h-4 inline mr-1 text-green-500" />
                    Abonnement actif
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleContact}
                    className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                    disabled
                  >
                    <Lock className="w-5 h-5" />
                    Contact verrouillé
                  </button>
                  <button
                    onClick={() => isAuthenticated ? setCurrentPage('subscription') : setCurrentPage('login')}
                    className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    {isAuthenticated ? 'S\'abonner - 1000 FCFA/semaine' : 'Se connecter pour contacter'}
                  </button>
                  <p className="text-center text-xs text-gray-500">
                    Abonnez-vous pour contacter LOMAL et organiser une visite
                  </p>
                </div>
              )}

              {/* Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  <strong>💡 Note:</strong> Vous ne contactez jamais le propriétaire directement. 
                  LOMAL organise les visites et vous accompagne jusqu'à la signature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
