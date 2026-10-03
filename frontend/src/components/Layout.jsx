import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Icon from './Icon';
export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); const titles = { '/': 'Descobrir', '/explorar': 'Explorar jogos', '/revenda': 'Revenda', '/perfil': 'Minha conta', '/entrar': 'Entrar', '/cadastro': 'Criar conta' }; document.title = `${titles[pathname] || 'Seu próximo jogo'} | UniGames`; }, [pathname]);
  return <><a className="skip-link" href="#main">Pular para o conteúdo</a><Navbar/><main id="main" className="container main-content"><Outlet/></main><footer className="footer"><div className="container footer-inner"><div><Link to="/" className="brand footer-brand"><Icon name="gamepad" size={27}/>uni<span>games</span><b>●</b></Link><p>Mais jogos. Melhores escolhas.</p></div><div className="footer-links"><Link to="/sobre-nos">Sobre o UniGames</Link><Link to="/suporte">Central de ajuda</Link><Link to="/configuracoes">Preferências</Link></div><p className="footer-note">Projeto acadêmico · UNIFACISA<br/>2026.2 · Feito por quem joga.</p></div></footer></>;
}
