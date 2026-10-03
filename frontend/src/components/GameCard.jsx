import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { money } from '../utils/format';
import Icon from './Icon';
import GameImage from './GameImage';
export default function GameCard({ game, offer }) {
  const { wishlist, toggleWishlist } = useApp(); const saved = wishlist.includes(game.id);
  return <article className="game-card">
    <Link className="card-image" to={`/jogo/${game.id}`}><GameImage game={game}/>{offer?.discount > 0 && <span className="media-label">OFERTA</span>}</Link>
    <button className={`favorite-btn ${saved ? 'saved' : ''}`} aria-label={`${saved ? 'Remover' : 'Adicionar'} ${game.titulo} ${saved ? 'dos' : 'aos'} favoritos`} aria-pressed={saved} onClick={() => toggleWishlist(game.id)}><Icon name="heart" size={17}/></button>
    <div className="card-body"><p className="eyebrow">{game.generos.slice(0, 2).join(' · ') || 'Jogo'}</p><h3><Link to={`/jogo/${game.id}`}>{game.titulo}</Link></h3><p className="platform-line"><Icon name="gamepad" size={13}/>{game.plataformas.includes('PC') ? 'PC' : game.plataformas[0] || 'Plataforma não informada'}{game.plataformas.length > 1 && <span>+{game.plataformas.length - 1} plataformas</span>}</p>
      <div className="card-price">{offer ? <><span className="discount">{offer.discount > 0 ? `-${offer.discount}%` : 'OFERTA'}</span><div className="price"><s>{offer.discount > 0 ? money(offer.precoOriginal) : '\u00a0'}</s><strong>{money(offer.preco)}</strong></div><span className="store-caption">{offer.loja}<Icon name="chevron" size={13}/></span></> : <span className="muted">Sem ofertas cadastradas</span>}</div>
    </div>
  </article>;
}
