import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/useApp';
import useResource from '../hooks/useResource';
import ListingCard from '../components/ListingCard';
import PageTitle from '../components/PageTitle';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';
export default function Revenda() {
  const { api, user } = useApp();
  const [params, setParams] = useSearchParams();
  const { data, loading, error, reload } = useResource('listings', () => api.listings());
  const q = params.get('q') || '';
  const platform = params.get('plataforma') || '';
  const condition = params.get('estado') || '';
  const order = params.get('ordem') || 'recentes';
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  const listings = data.filter(
    (l) =>
      (l.jogo?.titulo || '').toLowerCase().includes(q.toLowerCase()) &&
      (!platform || l.plataforma === platform) &&
      (!condition || l.estadoConservacao === condition),
  );
  listings.sort(
    order === 'menor-preco'
      ? (a, b) => a.preco - b.preco
      : (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  return (
    <>
      <PageTitle
        eyebrow="DE JOGADOR PARA JOGADOR"
        title="Uma nova história para cada jogo."
        text="Encontre mídia física na comunidade ou dê um novo destino à sua coleção."
      >
        <Link className="btn primary" to="/revenda/novo">
          <Icon name="plus" size={18} />
          Anunciar meu jogo
        </Link>
      </PageTitle>
      <div className="resale-intro">
        <Icon name="store" size={23} />
        <p>
          <strong>A negociação acontece entre vocês.</strong> Fale diretamente com o vendedor para
          combinar pagamento e entrega.
        </p>
        {user && (
          <Link className="text-link" to="/meus-anuncios">
            Meus anúncios <Icon name="arrow" size={16} />
          </Link>
        )}
      </div>
      <div className="resale-filters">
        <label className="search-field">
          Buscar jogo
          <div className="input-icon">
            <Icon name="search" size={17} />
            <input
              value={q}
              onChange={(e) => update('q', e.target.value)}
              placeholder="Encontre seu próximo jogo físico"
            />
          </div>
        </label>
        <label>
          Plataforma
          <select value={platform} onChange={(e) => update('plataforma', e.target.value)}>
            <option value="">Todas</option>
            {[...new Set(data.map((l) => l.plataforma))].sort().map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label>
          Conservação
          <select value={condition} onChange={(e) => update('estado', e.target.value)}>
            <option value="">Todos os estados</option>
            {['Novo', 'Excelente', 'Bom', 'Marcas de Uso'].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label>
          Ordenar
          <select value={order} onChange={(e) => update('ordem', e.target.value)}>
            <option value="recentes">Mais recentes</option>
            <option value="menor-preco">Menor preço</option>
          </select>
        </label>
      </div>
      <p className="results-count">
        <strong>{listings.length}</strong>{' '}
        {listings.length === 1 ? 'anúncio disponível' : 'anúncios disponíveis'}
      </p>
      {listings.length ? (
        <div className="listings-grid">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="store"
          title="Nenhum anúncio encontrado"
          text="Experimente outros filtros ou seja o primeiro a anunciar um jogo."
        >
          <Link to="/revenda/novo" className="btn primary">
            Criar anúncio
          </Link>
        </EmptyState>
      )}
    </>
  );
}
