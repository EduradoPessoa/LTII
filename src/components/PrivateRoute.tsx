import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, activeProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user || !activeProfile) {
        // Redireciona para login se não estiver autenticado
        navigate('/login', { state: { from: location } });
      } else if (!user.isAdmin && location.pathname.startsWith('/admin')) {
        // Redireciona usuário comum para o dashboard se tentar acessar rota admin
        navigate('/dashboard');
      }
    }
  }, [user, activeProfile, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || !activeProfile) {
    return null;
  }

  return <>{children}</>;
}
