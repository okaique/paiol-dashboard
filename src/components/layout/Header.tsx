
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfileDropdown } from './UserProfileDropdown';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const Header = ({ onMenuToggle, isMobileMenuOpen }: HeaderProps) => {
  const { user } = useAuth();

  const getUserInitials = (email: string) => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const getUserColor = (email: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const userInitials = getUserInitials(user?.email || '');
  const userColor = getUserColor(user?.email || '');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Menu Hambúrguer (Mobile) / Logo (Desktop) */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuToggle}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center">
            <h1 className="text-xl font-bold text-primary">Sistema de Paióis</h1>
          </div>
        </div>

        {/* Espaço central vazio (onde ficava a search bar) */}
        <div className="flex-1"></div>

        {/* Perfil do Usuário */}
        <div className="flex items-center">
          <UserProfileDropdown>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <div className={`h-8 w-8 rounded-full ${userColor} flex items-center justify-center text-white text-sm font-medium`}>
                {userInitials}
              </div>
            </Button>
          </UserProfileDropdown>
        </div>
      </div>
    </header>
  );
};
