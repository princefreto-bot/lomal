import { useEffect } from 'react';
import { useStore } from '@/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatPopup } from '@/components/ChatPopup';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import { Home } from '@/pages/Home';
import { Quartiers } from '@/pages/Quartiers';
import { Rooms } from '@/pages/Rooms';
import { RoomDetail } from '@/pages/RoomDetail';
import { Login } from '@/pages/Login';
import { Subscription } from '@/pages/Subscription';
import { Dashboard } from '@/pages/Dashboard';
import { Admin } from '@/pages/Admin';
import { AdminLogin } from '@/pages/AdminLogin';
import { LegalNotice } from '@/pages/LegalNotice';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { TermsOfService } from '@/pages/TermsOfService';

// Vérifier si l'admin est authentifié
function isAdminAuthenticated(): boolean {
  const auth = sessionStorage.getItem('lomal_admin_auth');
  const time = sessionStorage.getItem('lomal_admin_time');
  
  if (auth !== 'true' || !time) return false;
  
  // Session expire après 2 heures
  const sessionAge = Date.now() - parseInt(time);
  const twoHours = 2 * 60 * 60 * 1000;
  
  if (sessionAge > twoHours) {
    sessionStorage.removeItem('lomal_admin_auth');
    sessionStorage.removeItem('lomal_admin_time');
    return false;
  }
  
  return true;
}

export function App() {
  const { currentPage, setCurrentPage } = useStore();

  // Handle URL path for admin access
  useEffect(() => {
    const path = window.location.pathname;
    
    // Accès admin via /admin-login
    if (path === '/admin-login' || path.includes('admin-login')) {
      setCurrentPage('admin-login');
    }
    
    // Accès admin via /admin (nécessite authentification)
    if (path === '/admin' || path.includes('admin')) {
      if (isAdminAuthenticated()) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('admin-login');
      }
    }
    
    // Écouter les changements d'URL
    const handlePopState = () => {
      const newPath = window.location.pathname;
      if (newPath === '/admin-login') {
        setCurrentPage('admin-login');
      } else if (newPath === '/admin') {
        if (isAdminAuthenticated()) {
          setCurrentPage('admin');
        } else {
          setCurrentPage('admin-login');
        }
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setCurrentPage]);

  // Render page based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'quartiers':
        return <Quartiers />;
      case 'rooms':
        return <Rooms />;
      case 'room-detail':
        return <RoomDetail />;
      case 'login':
        return <Login />;
      case 'subscription':
        return <Subscription />;
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        // Vérifier l'authentification admin
        if (isAdminAuthenticated()) {
          return <Admin />;
        }
        return <AdminLogin />;
      case 'admin-login':
        return <AdminLogin />;
      case 'legal':
        return <LegalNotice />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      default:
        return <Home />;
    }
  };

  // Admin pages have their own layout
  if (currentPage === 'admin') {
    if (isAdminAuthenticated()) {
      return <Admin />;
    }
    return <AdminLogin />;
  }
  
  if (currentPage === 'admin-login') {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {renderPage()}
      </main>
      
      <Footer />
      
      {/* Chat Popup - Only show for authenticated users */}
      <ChatPopup />
      
      {/* Subscription Modal */}
      <SubscriptionModal />
    </div>
  );
}
