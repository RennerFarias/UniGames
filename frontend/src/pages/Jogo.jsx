import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/useApp';
import useResource from '../hooks/useResource';
import { config } from '../services/config';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import GameImage from '../components/GameImage';
import Icon from '../components/Icon';
import PriceChart from '../components/PriceChart';
import { money, fullDate, safeUrl } from '../utils/format';
export default function Jogo() {
  const { id } = useParams();
  const { api, user, wishlist, toggleWishlist, notify, refresh } = useApp();
  const { data, loading, error, reload } = useResource(`game:${id}`, () => api.game(id));
  const [tab, setTab] = useState('ofertas');
  const [note, setNote] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  const { game, reviews } = data;
  const offers = [...data.offers].sort((a, b) => a.preco - b.preco);
  const best = offers[0];
  const saved = wishlist.includes(id);
  const rating = reviews.length
    ? (reviews.reduce((n, r) => n + r.nota, 0) / reviews.length).toFixed(1)
    : null;
  async function submitReview(e) {
    e.preventDefault();
    setBusy(true);
    setFormError('');
    try {
      await api.createReview({ jogoId: id, nota: Number(note), comentario: comment.trim() });
      setComment('');
      notify('Avaliação publicada!');
      refresh();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <nav className="breadcrumbs" aria-label="Caminho">
        <Link to="/">Descobrir</Link>
        <Icon name="chevron" size={13} />
        <Link to="/explorar">Jogos</Link>
        <Icon name="chevron" size={13} />
        <span>{game.titulo}</span>
      </nav>
      <div className="game-detail-header">
        <div>
          <p className="eyebrow accent">SUA PRÓXIMA AVENTURA</p>
          <h1>{game.titulo}</h1>
          <div className="detail-tags">
            {game.generos.map((g) => (
              <Link key={g} to={`/explorar?genero=${encodeURIComponent(g)}`}>
                {g}
              </Link>
            ))}
            {rating && (
              <span className="rating">
                <Icon name="star" size={15} />
                {rating} <small>({reviews.length})</small>
              </span>
            )}
          </div>
        </div>
        <button
          className={`btn ${saved ? 'saved secondary' : 'secondary'}`}
          onClick={() => toggleWishlist(id)}
        >
          <Icon name="heart" size={17} />
          {saved ? 'Salvo nos favoritos' : 'Adicionar aos favoritos'}
        </button>
      </div>
      <div className="game-detail-layout">
        <section>
          <div className="detail-cover">
            <GameImage game={game} eager />
          </div>
          <div className="detail-tabs" role="tablist" aria-label="Informações do jogo">
            {[
              ['ofertas', 'Comparar ofertas'],
              ['historico', 'Histórico de preços'],
              ['avaliacoes', `Avaliações (${reviews.length})`],
            ].map(([key, label]) => (
              <button
                key={key}
                role="tab"
                id={`tab-${key}`}
                aria-selected={tab === key}
                aria-controls="game-panel"
                className={tab === key ? 'active' : ''}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="panel" id="game-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {tab === 'ofertas' && (
              <>
                <div className="panel-heading">
                  <h2>O mesmo jogo. Compare as ofertas.</h2>
                  <span>{offers.length} lojas</span>
                </div>
                {offers.length ? (
                  <div className="offer-list">
                    {offers.map((o, i) => (
                      <div className={`offer-row ${i === 0 ? 'best' : ''}`} key={o.id}>
                        <span className={`store-icon store-${o.loja.toLowerCase().split(' ')[0]}`}>
                          {o.loja.charAt(0)}
                        </span>
                        <div className="offer-store">
                          <strong>{o.loja}</strong>
                          <small>{i === 0 ? 'Melhor preço disponível' : 'Oferta da loja'}</small>
                        </div>
                        {o.discount > 0 && <span className="discount">-{o.discount}%</span>}
                        <div className="price">
                          {o.discount > 0 && <s>{money(o.precoOriginal)}</s>}
                          <strong>{money(o.preco)}</strong>
                        </div>
                        {safeUrl(o.urlLoja) ? (
                          <a
                            href={safeUrl(o.urlLoja)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn ${i === 0 ? 'primary' : 'secondary'}`}
                          >
                            {config.source === 'demo' ? 'Ver jogo' : 'Ir para loja'}
                            <Icon name="external" size={14} />
                          </a>
                        ) : (
                          <span className="muted">Link indisponível</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted">Nenhuma oferta cadastrada para este jogo.</p>
                )}
                <p className="small-note">
                  {config.source === 'demo'
                    ? 'Preços ilustrativos. Os links levam à página de referência do jogo.'
                    : 'A compra é finalizada na loja escolhida. Confira o preço e a plataforma antes de comprar.'}
                </p>
              </>
            )}
            {tab === 'historico' && (
              <>
                <div className="panel-heading">
                  <h2>Um bom preço tem uma história.</h2>
                  <Link className="text-link" to={`/historico?jogo=${id}`}>
                    Ver histórico completo <Icon name="arrow" size={15} />
                  </Link>
                </div>
                <PriceChart offers={offers} />
              </>
            )}
            {tab === 'avaliacoes' && (
              <>
                <div className="panel-heading">
                  <h2>O que a comunidade está dizendo</h2>
                  {rating && <span className="rating">★ {rating} / 5</span>}
                </div>
                <div className="review-list">
                  {reviews.length ? (
                    reviews.map((r) => (
                      <article className="review" key={r.id}>
                        <span className="review-avatar">{r.avaliador?.nome?.charAt(0) || 'P'}</span>
                        <div>
                          <strong>{r.avaliador?.nome || 'Jogador'}</strong>
                          <span className="review-stars" aria-label={`${r.nota} de 5 estrelas`}>
                            {'★'.repeat(r.nota)}
                            {'☆'.repeat(5 - r.nota)}
                          </span>
                          <p>{r.comentario || 'Sem comentário.'}</p>
                          <small>{fullDate(r.createdAt)}</small>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="muted">Seja o primeiro a avaliar este jogo.</p>
                  )}
                </div>
                {user ? (
                  <form className="form review-form" onSubmit={submitReview}>
                    <h3>Compartilhe sua experiência</h3>
                    <label>
                      Sua nota
                      <select value={note} onChange={(e) => setNote(e.target.value)}>
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'estrela' : 'estrelas'}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Comentário
                      <textarea
                        required
                        maxLength="1000"
                        rows="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="O que você achou do jogo?"
                      />
                    </label>
                    {formError && (
                      <p className="form-error" role="alert">
                        {formError}
                      </p>
                    )}
                    <button className="btn primary" disabled={busy}>
                      {busy ? 'Publicando…' : 'Publicar avaliação'}
                    </button>
                  </form>
                ) : (
                  <Link className="btn secondary" to={`/entrar?redirect=/jogo/${id}`}>
                    Entre para avaliar
                  </Link>
                )}
              </>
            )}
          </div>
        </section>
        <aside className="game-sidebar">
          <div className="panel">
            <p className="eyebrow accent">SOBRE O JOGO</p>
            <h2>Um novo mundo para explorar.</h2>
            <p>{game.descricao || 'A descrição deste jogo ainda não foi adicionada.'}</p>
            <hr />
            <h3>Plataformas disponíveis</h3>
            <div className="platform-chips">
              {game.plataformas.map((p) => (
                <span key={p}>
                  <Icon name="gamepad" size={14} />
                  {p}
                </span>
              ))}
            </div>
            {best && (
              <>
                <hr />
                <p className="muted">Menor preço no catálogo</p>
                <strong className="sidebar-price">{money(best.preco)}</strong>
                <p className="small-note">Atualização: {fullDate(best.updatedAt)}</p>
              </>
            )}
            <hr />
            <Link to={`/revenda?q=${encodeURIComponent(game.titulo)}`} className="text-link">
              <Icon name="store" size={17} />
              Procurar mídia física <Icon name="arrow" size={15} />
            </Link>
          </div>
          <div className="sidebar-tip">
            <Icon name="shield" size={22} />
            <p>
              <strong>A melhor escolha é a sua.</strong>Confira a plataforma e as condições na loja
              antes de adquirir o jogo.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
