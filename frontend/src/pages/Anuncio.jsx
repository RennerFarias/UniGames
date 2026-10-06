import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/useApp';
import useResource from '../hooks/useResource';
import GameImage from '../components/GameImage';
import PageTitle from '../components/PageTitle';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Icon from '../components/Icon';
import { idOf } from '../models/entities';
import { money, fullDate } from '../utils/format';
export default function Anuncio() {
  const { id } = useParams();
  const { api, user } = useApp();
  const [show, setShow] = useState(false);
  const { data: l, loading, error, reload } = useResource(`listing:${id}`, () => api.listing(id));
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  return (
    <>
      <Link className="back-link" to="/revenda">
        ← Voltar para a comunidade
      </Link>
      <PageTitle
        eyebrow="MÍDIA FÍSICA · COMUNIDADE"
        title={l.jogo?.titulo || 'Anúncio de jogo'}
        text={`Anunciado em ${fullDate(l.createdAt)} por ${l.contato.nome}`}
      />
      <div className="listing-detail-layout">
        <div className="panel">
          <GameImage game={l.jogo} className="listing-detail-image" eager />
          <h2>Sobre este anúncio</h2>
          <p className="preserve-lines">
            {l.descricao || 'O vendedor não adicionou uma descrição.'}
          </p>
          <div className="detail-facts">
            <div>
              <span>Plataforma</span>
              <strong>{l.plataforma}</strong>
            </div>
            <div>
              <span>Conservação</span>
              <strong>{l.estadoConservacao}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>
                {{ ativo: 'Disponível', vendido: 'Vendido', pausado: 'Pausado' }[l.status]}
              </strong>
            </div>
          </div>
          <p className="small-note">
            A capa é uma referência do jogo. Peça fotos reais da mídia e da caixa ao vendedor.
          </p>
        </div>
        <aside className="panel listing-contact">
          <p className="eyebrow accent">PREÇO DO VENDEDOR</p>
          <strong className="listing-big-price">{money(l.preco)}</strong>
          <hr />
          <div className="seller-profile">
            <span className="large-avatar">{l.contato.nome.charAt(0)}</span>
            <div>
              <strong>{l.contato.nome}</strong>
              <p>Jogador da comunidade</p>
            </div>
          </div>
          {l.status === 'ativo' ? (
            <button className="btn primary full" onClick={() => setShow(true)}>
              <Icon name="mail" size={17} />
              Ver contato do vendedor
            </button>
          ) : (
            <p className="small-note">Este anúncio não está disponível para negociação.</p>
          )}
          {show && (
            <div className="contact-reveal">
              <span>Entre em contato por</span>
              <strong>{l.contato.info}</strong>
              {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.contato.info) && (
                <a className="text-link" href={`mailto:${encodeURIComponent(l.contato.info)}`}>
                  Enviar e-mail <Icon name="external" size={14} />
                </a>
              )}
            </div>
          )}
          <p className="small-note">
            Combine pagamento e entrega diretamente com o vendedor. O UniGames não processa
            pagamentos.
          </p>
          {user && (idOf(l.vendedor) === user.id || user.perfil === 'admin') && (
            <Link to={`/revenda/${id}/editar`} className="btn secondary full">
              <Icon name="edit" size={16} />
              Editar anúncio
            </Link>
          )}
        </aside>
      </div>
    </>
  );
}
