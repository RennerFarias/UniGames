import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import useResource from '../hooks/useResource';
import AccountNav from '../components/AccountNav';
import PageTitle from '../components/PageTitle';
import GameImage from '../components/GameImage';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import Icon from '../components/Icon';
import { money } from '../utils/format';

export default function MeusAnuncios() {
  const { api, notify, refresh, user, updateUser } = useApp();
  const { data, loading, error, reload } = useResource('my-listings', () => api.myListings());
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);
  const [nascimento, setNascimento] = useState('');
  const [activating, setActivating] = useState(false);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  async function deleteListing() {
    setBusy(true);
    try {
      await api.deleteListing(remove.id);
      setRemove(null);
      refresh();
      notify('Anúncio excluído.');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function handleUpgrade(event) {
    event.preventDefault();
    setActivating(true);
    try {
      const updated = await api.tornarRevendedor(user.dataNascimento ? undefined : nascimento);
      updateUser(updated);
      notify('Sua conta de revendedor foi ativada.');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setActivating(false);
    }
  }

  const title = (
    <PageTitle
      eyebrow="SUA COLEÇÃO EM MOVIMENTO"
      title="Meus anúncios"
      text="Gerencie sua mídia física e acompanhe os jogos que ganharam um novo dono."
    />
  );

  if (!user.revendedor && user.perfil !== 'admin') {
    return (
      <>
        {title}
        <AccountNav />
        <EmptyState
          icon="store"
          title="Torne-se um revendedor"
          text="Ative sua conta para anunciar seus jogos. A idade mínima é 16 anos."
        >
          <form className="seller-activation" onSubmit={handleUpgrade}>
            {!user.dataNascimento && (
              <label>
                Data de nascimento
                <input
                  type="date"
                  required
                  value={nascimento}
                  max={today}
                  onChange={(event) => setNascimento(event.target.value)}
                />
              </label>
            )}
            <button type="submit" className="btn primary" disabled={activating}>
              {activating ? 'Ativando...' : 'Quero ser revendedor'}
            </button>
          </form>
        </EmptyState>
      </>
    );
  }

  return (
    <>
      <PageTitle
        eyebrow="SUA COLEÇÃO EM MOVIMENTO"
        title="Meus anúncios"
        text="Gerencie sua mídia física e acompanhe os jogos que ganharam um novo dono."
      >
        <Link to="/revenda/novo" className="btn primary">
          <Icon name="plus" size={18} />
          Novo anúncio
        </Link>
      </PageTitle>
      <AccountNav />
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : data.length ? (
        <div className="my-listings">
          {data.map((listing) => (
            <article key={listing.id} className="my-listing">
              <Link className="my-listing-cover" to={'/revenda/' + listing.id}>
                <GameImage game={listing.jogo} />
              </Link>
              <div className="my-listing-title">
                <span className={'status ' + listing.status}>
                  {{ ativo: 'Disponível', vendido: 'Vendido', pausado: 'Pausado' }[listing.status]}
                </span>
                <h3>{listing.jogo?.titulo || 'Jogo removido'}</h3>
                <p>
                  {listing.plataforma} · {listing.estadoConservacao}
                </p>
              </div>
              <strong>{money(listing.preco)}</strong>
              <div className="my-listing-actions">
                <Link to={'/revenda/' + listing.id + '/editar'} className="btn secondary small">
                  <Icon name="edit" size={15} />
                  Editar
                </Link>
                <button
                  className="icon-btn danger-text"
                  aria-label={'Excluir anúncio de ' + listing.jogo?.titulo}
                  onClick={() => setRemove(listing)}
                >
                  <Icon name="trash" size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="store"
          title="Sua prateleira de anúncios está vazia"
          text="Anuncie um jogo físico e encontre outro jogador para continuar a história."
        >
          <Link to="/revenda/novo" className="btn primary">
            Criar meu primeiro anúncio
          </Link>
        </EmptyState>
      )}
      <ConfirmDialog
        open={Boolean(remove)}
        title="Excluir anúncio?"
        text={'O anúncio de ' + (remove?.jogo?.titulo || 'este jogo') + ' será removido.'}
        busy={busy}
        onCancel={() => setRemove(null)}
        onConfirm={deleteListing}
      />
    </>
  );
}
