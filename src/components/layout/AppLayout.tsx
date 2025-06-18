
import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState('16rem');

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSidebarWidthChange = (width: string) => {
    setSidebarWidth(width);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarWidth('0rem');
      } else {
        setSidebarWidth('16rem');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header fixo */}
      <Header 
        onMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Sidebar Desktop */}
      <Sidebar 
        className="hidden lg:block" 
        onWidthChange={handleSidebarWidthChange}
      />

      {/* Sidebar Mobile */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      />

      {/* Main Content */}
      <main 
        className="pt-16 transition-all duration-300 lg:ml-64" 
        style={{
          marginLeft: window.innerWidth >= 1024 ? sidebarWidth : '0'
        }}
      >
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
