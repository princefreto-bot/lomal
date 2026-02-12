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
import { LegalNotice } from '@/pages/LegalNotice';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { TermsOfService } from '@/pages/TermsOfService';

export function App() {
  const { currentPage, setCurrentPage } = useStore();

  // Handle URL hash for admin access
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'admin') {
      setCurrentPage('admin');
    }
    
    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash === 'admin') {
        setCurrentPage('admin');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
        return <Admin />;
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

  // Admin page has its own layout
  if (currentPage === 'admin') {
    return <Admin />;
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
