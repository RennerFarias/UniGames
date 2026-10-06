import { Link } from 'react-router-dom';
import GameImage from './GameImage';
import Icon from './Icon';
import { money, shortDate } from '../utils/format';
export default function ListingCard({ listing }) {
  return (
    <article className="listing-card">
      <Link className="listing-image" to={`/revenda/${listing.id}`}>
        <GameImage game={listing.jogo} />
        <span className="physical-label">MÍDIA FÍSICA</span>
      </Link>
      <div className="card-body">
        <p className="eyebrow">
          {listing.plataforma} · {listing.estadoConservacao}
        </p>
        <h3>
          <Link to={`/revenda/${listing.id}`}>
            {listing.jogo?.titulo || 'Jogo removido do catálogo'}
          </Link>
        </h3>
        <p className="listing-description">
          {listing.descricao || 'Confira os detalhes com o vendedor.'}
        </p>
        <div className="listing-seller">
          <span>{listing.contato.nome.charAt(0)}</span>
          {listing.contato.nome}
          <small>{shortDate(listing.createdAt)}</small>
        </div>
        <div className="listing-footer">
          <strong>{money(listing.preco)}</strong>
          <Link to={`/revenda/${listing.id}`} className="text-link">
            Ver anúncio <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
