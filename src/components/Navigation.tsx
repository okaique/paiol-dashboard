import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const { signOut } = useAuth();

  return (
    <div className="flex h-16 w-full items-center bg-secondary px-6">
      <Link
        to="/"
        className="mr-auto text-lg font-semibold transition-colors hover:text-primary"
      >
        Controle de Paiol
      </Link>
      <nav className="flex items-center space-x-6">
        <Link
          to="/"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Dashboard
        </Link>
        <Link
          to="/paiols"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Paióis
        </Link>
        <Link
          to="/pessoal"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Pessoal
        </Link>
        <Link
          to="/tipos-insumos"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Tipos de Insumos
        </Link>
        <Link
          to="/clientes"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Clientes
        </Link>
        <Link
          to="/caminhoes"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Caminhões
        </Link>
        <Link
          to="/relatorios"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Relatórios
        </Link>
      </nav>
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        Sair
      </Button>
    </div>
  );
}
