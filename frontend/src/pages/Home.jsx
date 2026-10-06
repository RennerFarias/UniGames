import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import useResource from '../hooks/useResource';
import GameCard from '../components/GameCard';
import GameImage from '../components/GameImage';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { bestOffer, money, safeUrl } from '../utils/format';
export default function Home() {
  const { api } = useApp();
  const { data, loading, error, reload } = useResource('catalog', () => api.catalog());
  const [featured, setFeatured] = useState(0);
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!data.games.length)
    return (
      <EmptyState
        icon="gamepad"
        title="Seu catálogo começa aqui"
        text="Ainda não há jogos cadastrados. Um administrador pode adicionar jogos e ofertas pelo painel."
      />
    );
  const highlights = data.games.slice(0, 4);
  const game = highlights[featured % highlights.length];
  const offer = bestOffer(game, data.offers);
  const scene = game.titulo.toUpperCase().includes('ELDEN RING')
    ? '/games/elden-scene-0.jpg'
    : game.imagemCapa?.startsWith('/games/')
      ? game.imagemCapa
      : safeUrl(game.imagemCapa);
  const discounted = data.games
    .map((g) => ({ game: g, offer: bestOffer(g, data.offers) }))
    .filter((g) => g.offer)
    .sort((a, b) => b.offer.discount - a.offer.discount);
  return (
    <>
      <div className="home-heading">
        <div>
          <span className="eyebrow accent">JOGAR MAIS. GASTAR MENOS.</span>
          <h1>
            Seu próximo jogo está aqui<span>.</span>
          </h1>
        </div>
        <p>
          Compare lojas. Descubra ofertas.
          <br />
          Encontre sua próxima aventura.
        </p>
      </div>
      <section className="hero-layout" aria-label="Jogos em destaque">
        <div className="hero" style={scene ? { backgroundImage: `url("${scene}")` } : undefined}>
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="hero-kicker">
              <span className="live-dot" /> DESTAQUE DA SEMANA
            </p>
            <div className="hero-tags">
              {game.generos.map((g) => (
                <span key={g}>{g}</span>
              ))}
            </div>
            <h2>{game.titulo}</h2>
            <p className="hero-description">{game.descricao}</p>
            {offer && (
              <div className="hero-price">
                <span className="discount">-{offer.discount}%</span>
                <div>
                  <s>{money(offer.precoOriginal)}</s>
                  <strong>{money(offer.preco)}</strong>
                </div>
                <span className="hero-store">a partir de · {offer.loja}</span>
              </div>
            )}
            <Link className="btn primary" to={`/jogo/${game.id}`}>
              Explorar o jogo <Icon name="arrow" size={18} />
            </Link>
            <div className="hero-dots">
              {highlights.map((g, i) => (
                <button
                  key={g.id}
                  aria-label={`Destacar ${g.titulo}`}
                  aria-pressed={featured % highlights.length === i}
                  className={featured % highlights.length === i ? 'active' : ''}
                  onClick={() => setFeatured(i)}
                />
              ))}
            </div>
          </div>
          <span className="hero-fineprint">Uma aventura. Várias possibilidades.</span>
        </div>
        <aside className="featured-rail">
          <p className="eyebrow">NO SEU RADAR</p>
          {highlights.map((g, i) => (
            <button
              key={g.id}
              className={`rail-game ${featured % highlights.length === i ? 'active' : ''}`}
              onClick={() => setFeatured(i)}
              aria-pressed={featured % highlights.length === i}
            >
              <GameImage game={g} />
              <span>
                <strong>{g.titulo}</strong>
                <small>
                  {g.generos[0]}
                  {bestOffer(g, data.offers) && ` · ${money(bestOffer(g, data.offers).preco)}`}
                </small>
              </span>
              <Icon name="chevron" size={15} />
            </button>
          ))}
          <div className="rail-bottom">
            <Icon name="tag" size={22} />
            <strong>
              O mesmo jogo.
              <br />
              Um preço melhor.
            </strong>
            <p>Veja as ofertas de diferentes lojas em um só lugar.</p>
            <Link to="/explorar?ofertas=1">
              Encontrar ofertas <Icon name="arrow" size={15} />
            </Link>
          </div>
        </aside>
      </section>
      <div className="benefits">
        <div>
          <span>
            <Icon name="tag" />
          </span>
          <p>
            <strong>Compare antes de comprar</strong>
            <small>Ofertas lado a lado, escolha fácil.</small>
          </p>
        </div>
        <div>
          <span>
            <Icon name="chart" />
          </span>
          <p>
            <strong>O preço tem uma história</strong>
            <small>Acompanhe as variações de cada loja.</small>
          </p>
        </div>
        <div>
          <span>
            <Icon name="store" />
          </span>
          <p>
            <strong>De jogador para jogador</strong>
            <small>Um novo destino para seus jogos físicos.</small>
          </p>
        </div>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow accent">VALE A PENA CONFERIR</p>
            <h2>
              Grandes jogos, pequenos preços <Icon name="tag" size={23} />
            </h2>
          </div>
          <Link className="text-link" to="/explorar?ofertas=1">
            Ver todas as ofertas <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="games-grid">
          {discounted.slice(0, 4).map(({ game: g, offer: o }) => (
            <GameCard key={g.id} game={g} offer={o} />
          ))}
        </div>
      </section>
      <section className="genre-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow accent">DO SEU JEITO</p>
            <h2>Qual é a sua próxima aventura?</h2>
          </div>
        </div>
        <div className="genre-grid">
          {[
            ['RPG', 'Histórias que ficam', 'baldurs-gate'],
            ['Ação', 'Sem tempo para respirar', 'god-of-war'],
            ['Indie', 'Pequenos grandes mundos', 'hollow-knight'],
            ['Corrida', 'Acelere o seu próximo play', 'forza'],
          ].map(([name, tagline, slug]) => (
            <Link
              key={name}
              to={`/explorar?genero=${encodeURIComponent(name)}`}
              className="genre-card"
              style={{ backgroundImage: `url(/games/${slug}.jpg)` }}
            >
              <span>
                <strong>{name}</strong>
                <small>{tagline}</small>
              </span>
              <Icon name="arrow" size={20} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow accent">MAIS PARA EXPLORAR</p>
            <h2>Descubra seu próximo favorito</h2>
          </div>
          <Link className="text-link" to="/explorar">
            Explorar o catálogo <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="games-grid">
          {data.games.slice(0, 4).map((g) => (
            <GameCard key={g.id} game={g} offer={bestOffer(g, data.offers)} />
          ))}
        </div>
      </section>
      <section className="community-banner">
        <div className="community-symbol">
          <Icon name="gamepad" size={58} />
          <span>↔</span>
        </div>
        <div>
          <p className="eyebrow">A COMUNIDADE TAMBÉM JOGA JUNTO</p>
          <h2>
            Terminou um jogo?
            <br />
            Comece uma nova história.
          </h2>
          <p>
            Anuncie sua mídia física ou encontre o próximo jogo
            <br className="desktop-only" /> na coleção de outro jogador.
          </p>
        </div>
        <Link to="/revenda" className="btn primary">
          Conhecer a revenda <Icon name="arrow" size={17} />
        </Link>
      </section>
    </>
  );
}
