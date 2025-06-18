
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home,
  Package,
  UserCheck,
  Users,
  Truck,
  Settings,
  Building,
  Wrench,
  BarChart3,
  FuelIcon as Fuel,
  Shield,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mesma organização em grupos do desktop
const navigationGroups = [
  {
    title: 'Principal',
    items: [
      { title: 'Dashboard', href: '/', icon: Home },
    ]
  },
  {
    title: 'Gestão de Paióis',
    items: [
      { title: 'Paióis', href: '/paiols', icon: Package },
      { title: 'Pessoal', href: '/pessoal', icon: UserCheck },
      { title: 'Tipos de Insumos', href: '/tipos-insumos', icon: Fuel },
    ]
  },
  {
    title: 'Gestão de Clientes',
    items: [
      { title: 'Clientes', href: '/clientes', icon: Users },
      { title: 'Caminhões', href: '/caminhoes', icon: Truck },
    ]
  },
  {
    title: 'Equipamentos',
    items: [
      { title: 'Equipamentos', href: '/equipamentos', icon: Settings },
      { title: 'Empresas Mecânicas', href: '/empresas-mecanicas', icon: Building },
      { title: 'Tipos de Manutenção', href: '/tipos-manutencao', icon: Wrench },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { title: 'Gerenciar Usuários', href: '/gerenciar-usuarios', icon: Shield, adminOnly: true },
      { title: 'Configurações', href: '/configuracoes', icon: Settings },
      { title: 'Relatórios', href: '/relatorios', icon: BarChart3 },
    ]
  }
];

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const location = useLocation();
  const { userRole } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-background border-r border-border lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-primary">Sistema de Paióis</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-80px)]">
          {navigationGroups.map((group, groupIndex) => {
            // Filtrar itens do grupo baseado nas permissões
            const filteredItems = group.items.filter(item => {
              if (item.adminOnly) {
                return userRole === 'administrador';
              }
              return true;
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-3">
                {/* Título do grupo */}
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-l-4 border-primary pl-3">
                  {group.title}
                </h3>
                
                {/* Itens do grupo */}
                <div className="space-y-1">
                  {filteredItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-base transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive(item.href) 
                          ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                          : "text-foreground hover:bg-accent/50"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>

                {/* Separador entre grupos */}
                {groupIndex < navigationGroups.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            );
          })}

          {/* Footer do móvel */}
          <div className="pt-6 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Sistema de Paióis v1.0
            </p>
            {userRole && (
              <p className="text-xs text-muted-foreground text-center mt-1">
                Papel: <span className="font-medium capitalize">{userRole}</span>
              </p>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};
