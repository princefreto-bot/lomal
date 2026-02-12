import { useState } from 'react';
import { Menu, X, Home, MapPin, User, LogOut } from 'lucide-react';
import { useStore } from '@/store';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, setCurrentPage, currentPage } = useStore();

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'quartiers', label: 'Quartiers', icon: MapPin },
    { id: 'rooms', label: 'Chambres', icon: Home },
  ];

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-black">
              LOMAL <span className="font-light">IMMOBILIER</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  currentPage === item.id 
                    ? 'text-black' 
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                >
                  <User className="w-4 h-4" />
                  {user?.name}
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Connexion
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                  currentPage === item.id 
                    ? 'bg-gray-100 text-black' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            
            <hr className="my-3" />
            
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <User className="w-5 h-5" />
                  Mon compte
                </button>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full bg-black text-white p-3 rounded-lg font-medium"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
