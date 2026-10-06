import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/useApp';
import Loading from './Loading';
import EmptyState from './EmptyState';
export default function ProtectedRoute({ admin = false }) {
  const { user, authReady } = useApp();
  const location = useLocation();
  if (!authReady) return <Loading />;
  if (!user)
    return (
      <Navigate
        replace
        to={`/entrar?redirect=${encodeURIComponent(location.pathname + location.search)}`}
      />
    );
  if (admin && user.perfil !== 'admin')
    return (
      <EmptyState
        icon="shield"
        title="Área de administração"
        text="Este painel está disponível para administradores do catálogo."
      />
    );
  return <Outlet />;
}
