import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { useMutation } from '@apollo/client';
import { TORNAR_REVENDEDOR } from '../graphql/mutations';
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
  const { api, notify, refresh, user, updateUser} = useApp(); 
  const { data, loading, error, reload } = useResource('my-listings', () => api.myListings()); 
  const [remove, setRemove] = useState(null); 
  const [busy, setBusy] = useState(false);
  const [nascimento, setNascimento] = useState('');
  const [upgradeUser, { loading: mutLoading }] = useMutation(TORNAR_REVENDEDOR);

  async function deleteListing() { 
    setBusy(true); 
    try { 
      await api.deleteListing(remove.id); 
      setRemove(null); 
      notify('Anúncio excluído.'); 
      refresh(); 
    } catch (err) { 
      notify(err.message, 'error'); 
    } finally { 
      setBusy(false); 
    } 
  }

  async function handleUpgrade(e) {
    e.preventDefault();
    try {
      const { data } = await upgradeUser({ 
        variables: { dataNascimento: user?.dataNascimento ? undefined : nascimento } 
      });
      updateUser(data.tornarRevendedor);
      notify('Parabéns! Sua loja foi ativada.');
    } catch (err) {
      notify(err.message, 'error');
    }
}

  if (!user?.revendedor) {
    return (
      <>
        <PageTitle eyebrow="SUA COLEÇÃO EM MOVIMENTO" title="Meus anúncios" text="Gerencie sua mídia física e acompanhe os jogos que ganharam um novo dono." />
        <AccountNav />
        <EmptyState icon="store" title="Torne-se um Revendedor" text="Para anunciar seus jogos e vender na plataforma, você precisa ativar sua conta de revendedor.">
          <form onSubmit={handleUpgrade} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            {/* Pede a data apenas se o usuário NÃO preencheu no cadastro */}
            {!user?.dataNascimento && (
              <label style={{ textAlign: 'left', width: '100%', maxWidth: '250px' }}>
                Data de Nascimento (Obrigatório)
                <input type="date" required value={nascimento} onChange={e => setNascimento(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }} />
              </label>
            )}
            <button type="submit" className="btn primary" disabled={mutLoading}>
              {mutLoading ? 'Ativando...' : 'Quero ser Revendedor'}
            </button>
          </form>
        </EmptyState>
      </>
    );
  }

  return <><PageTitle eyebrow="SUA COLEÇÃO EM MOVIMENTO" title="Meus anúncios" text="Gerencie sua mídia física e acompanhe os jogos que ganharam um novo dono."><Link to="/revenda/novo" className="btn primary"><Icon name="plus" size={18}/>Novo anúncio</Link></PageTitle><AccountNav/>{loading ? <Loading/> : error ? <ErrorMessage message={error} onRetry={reload}/> : data.length ? <div className="my-listings">{data.map(l => <article key={l.id} className="my-listing"><Link className="my-listing-cover" to={`/revenda/${l.id}`}><GameImage game={l.jogo}/></Link><div className="my-listing-title"><span className={`status ${l.status}`}>{({ ativo: 'Disponível', vendido: 'Vendido', pausado: 'Pausado' })[l.status]}</span><h3>{l.jogo?.titulo || 'Jogo removido'}</h3><p>{l.plataforma} · {l.estadoConservacao}</p></div><strong>{money(l.preco)}</strong><div className="my-listing-actions"><Link to={`/revenda/${l.id}/editar`} className="btn secondary small"><Icon name="edit" size={15}/>Editar</Link><button className="icon-btn danger-text" aria-label={`Excluir anúncio de ${l.jogo?.titulo}`} onClick={() => setRemove(l)}><Icon name="trash" size={18}/></button></div></article>)}</div> : <EmptyState icon="store" title="Sua prateleira de anúncios está vazia" text="Anuncie um jogo físico e encontre outro jogador para continuar a história."><Link to="/revenda/novo" className="btn primary">Criar meu primeiro anúncio</Link></EmptyState>}<ConfirmDialog open={!!remove} title="Excluir anúncio?" text={`O anúncio de ${remove?.jogo?.titulo || 'este jogo'} será removido.`} busy={busy} onCancel={() => setRemove(null)} onConfirm={deleteListing}/></>;
}