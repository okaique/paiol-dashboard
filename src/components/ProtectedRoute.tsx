
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/AuthForm';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { user: !!user, loading, pathname: location.pathname });
    
    // Se não está carregando e não há usuário, redirecionar para auth apenas se não estivermos já lá
    if (!loading && !user && location.pathname !== '/auth') {
      console.log('Redirecionando para /auth...');
      navigate('/auth', { replace: true });
    }
    
    // Se há usuário e estamos na página de auth, redirecionar para home
    if (!loading && user && location.pathname === '/auth') {
      console.log('Usuário logado, redirecionando para home...');
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário, mostrar formulário de login
  if (!user) {
    return <AuthForm />;
  }

  // Se há usuário, mostrar conteúdo protegido
  return <>{children}</>;
};
