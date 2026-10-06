import { NavLink } from 'react-router-dom';
import { useApp } from '../context/useApp';
import Icon from './Icon';
export default function AccountNav() {
  const { user } = useApp();
  return (
    <nav className="account-nav" aria-label="Minha conta">
      <NavLink to="/perfil">
        <Icon name="user" size={17} />
        Meu perfil
      </NavLink>
      <NavLink to="/meus-anuncios">
        <Icon name="store" size={17} />
        Meus anúncios
      </NavLink>
      <NavLink to="/relatorios">
        <Icon name="chart" size={17} />
        Relatórios
      </NavLink>
      {user?.perfil === 'admin' && (
        <NavLink to="/admin">
          <Icon name="shield" size={17} />
          Administração
        </NavLink>
      )}
    </nav>
  );
}
