import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { config } from '../services/config';
import Icon from './Icon';
export default function Navbar() {
  const { user, wishlist } = useApp(); const navigate = useNavigate(); const [search, setSearch] = useState(''); const [open, setOpen] = useState(false);
  function submit(e) { e.preventDefault(); navigate(`/explorar?q=${encodeURIComponent(search.trim())}`); setOpen(false); }
  return <>
    <div className="announcement"><span><span className="live-dot"/> Seu próximo jogo. Pelo melhor preço.</span>{config.source === 'demo' && <span className="demo-label">DEMONSTRAÇÃO · preços ilustrativos</span>}<Link to="/revenda">Conheça a revenda da comunidade <Icon name="arrow" size={13}/></Link></div>
    <header className="header"><div className="header-inner"><Link to="/" className="brand" aria-label="UniGames início"><span className="brand-mark"><Icon name="gamepad" size={28}/></span>uni<span>games</span><b>●</b></Link>
      <nav className="primary-nav" aria-label="Navegação principal"><NavLink to="/" end>Descobrir</NavLink><NavLink to="/explorar">Explorar</NavLink><NavLink to="/revenda">Revenda <span className="tiny-tag">COMUNIDADE</span></NavLink></nav>
      <form className="header-search" role="search" onSubmit={submit}><Icon name="search" size={17}/><input aria-label="Buscar jogos" placeholder="Qual vai ser o próximo jogo?" value={search} onChange={e => setSearch(e.target.value)}/><button aria-label="Pesquisar"><Icon name="arrow" size={15}/></button></form>
      <Link className="header-heart" to="/favoritos" aria-label={`Favoritos: ${wishlist.length}`}><Icon name="heart"/>{wishlist.length > 0 && <span>{wishlist.length}</span>}</Link>
      <Link className="account-link" to={user ? '/perfil' : '/entrar'}><span className="account-avatar">{user ? user.nome.charAt(0).toUpperCase() : <Icon name="user" size={17}/>}</span><span>{user ? user.nome.split(' ')[0] : 'Entrar'}</span></Link>
      <button className="mobile-toggle icon-btn" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'}/></button>
    </div>{open && <nav className="mobile-menu" aria-label="Menu móvel"><Link onClick={() => setOpen(false)} to="/">Descobrir</Link><Link onClick={() => setOpen(false)} to="/explorar">Explorar jogos</Link><Link onClick={() => setOpen(false)} to="/revenda">Revenda</Link><Link onClick={() => setOpen(false)} to="/favoritos">Favoritos</Link><Link onClick={() => setOpen(false)} to="/perfil">Minha conta</Link><form role="search" onSubmit={submit}><input aria-label="Busca no menu" placeholder="Buscar jogo" value={search} onChange={e => setSearch(e.target.value)}/><button className="btn primary">Buscar</button></form></nav>}</header>
    <div className="subnav"><div className="container subnav-inner"><Link to="/explorar?ofertas=1"><Icon name="tag" size={15}/>Todas as ofertas</Link><Link to="/explorar?genero=RPG">RPG</Link><Link to="/explorar?genero=Ação">Ação & aventura</Link><Link to="/explorar?genero=Indie">Indies</Link><Link to="/explorar?plataforma=PC">PC</Link><Link to="/explorar?plataforma=PlayStation%205">PlayStation</Link><Link to="/explorar?plataforma=Xbox%20Series">Xbox</Link><Link to="/historico"><Icon name="chart" size={15}/>Histórico de preços</Link></div></div>
  </>;
}
