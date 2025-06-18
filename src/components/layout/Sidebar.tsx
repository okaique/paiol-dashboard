
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Truck, 
  UserCheck, 
  Package, 
  FileText,
  Settings,
  BarChart3,
  Wrench,
  Building,
  ChevronLeft,
  ChevronRight,
  FuelIcon as Fuel,
  Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';

// Organização das opções em grupos
const navigationGroups = [
  {
    label: 'Principal',
    items: [
      { name: 'Dashboard', href: '/', icon: Home },
    ]
  },
  {
    label: 'Gestão de Paióis',
    items: [
      { name: 'Paióis', href: '/paiols', icon: Package },
      { name: 'Pessoal', href: '/pessoal', icon: UserCheck },
      { name: 'Tipos de Insumos', href: '/tipos-insumos', icon: Fuel },
    ]
  },
  {
    label: 'Gestão de Clientes',
    items: [
      { name: 'Clientes', href: '/clientes', icon: Users },
      { name: 'Caminhões', href: '/caminhoes', icon: Truck },
    ]
  },
  {
    label: 'Equipamentos',
    items: [
      { name: 'Equipamentos', href: '/equipamentos', icon: Settings },
      { name: 'Empresas Mecânicas', href: '/empresas-mecanicas', icon: Building },
      { name: 'Tipos de Manutenção', href: '/tipos-manutencao', icon: Wrench },
    ]
  },
  {
    label: 'Sistema',
    items: [
      { name: 'Gerenciar Usuários', href: '/gerenciar-usuarios', icon: Shield, adminOnly: true },
      { name: 'Configurações', href: '/configuracoes', icon: Settings },
      { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
    ]
  }
];

interface SidebarProps {
  className?: string;
  onWidthChange?: (width: string) => void;
}

export const Sidebar = ({ className, onWidthChange }: SidebarProps) => {
  const location = useLocation();
  const { userRole } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const newWidth = isCollapsed ? '4rem' : '16rem';
    onWidthChange?.(newWidth);
  }, [isCollapsed, onWidthChange]);

  return (
    <div className={cn(
      "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-2 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
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
              <div key={group.label} className="space-y-1">
                {/* Label do grupo - apenas quando não collapsed */}
                {!isCollapsed && (
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.label}
                    </h3>
                  </div>
                )}

                {/* Itens do grupo */}
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const isActive = location.pathname === item.href || 
                                   (item.href !== '/' && location.pathname.startsWith(item.href));
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          'flex items-center rounded-md transition-colors group',
                          isCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        )}
                        title={isCollapsed ? item.name : undefined}
                      >
                        <item.icon className={cn(
                          "flex-shrink-0",
                          isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-3"
                        )} />
                        {!isCollapsed && (
                          <span className="text-sm font-medium">{item.name}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Separador entre grupos - apenas quando não collapsed e não é o último grupo */}
                {!isCollapsed && groupIndex < navigationGroups.length - 1 && (
                  <Separator className="my-3" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Sistema de Paióis v1.0
            </p>
            {userRole && (
              <p className="text-xs text-muted-foreground text-center mt-1">
                Papel: <span className="font-medium capitalize">{userRole}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
