import { useState } from 'react';
import { useApp } from '../context/useApp';
import { config } from '../services/config';
import PageTitle from '../components/PageTitle';
import ConfirmDialog from '../components/ConfirmDialog';
import Icon from '../components/Icon';
export default function Configuracoes() {
  const { notify, api, logout } = useApp();
  const [reduce, setReduce] = useState(
    () => localStorage.getItem('unigames.reduce-motion') === 'true',
  );
  const [reset, setReset] = useState(false);
  function toggle(value) {
    setReduce(value);
    localStorage.setItem('unigames.reduce-motion', String(value));
    document.documentElement.dataset.reduceMotion = String(value);
    notify('Preferência salva.');
  }
  function clearDemo() {
    api.reset();
    logout();
    window.location.assign('/');
  }
  return (
    <>
      <PageTitle
        eyebrow="DO SEU JEITO"
        title="Preferências"
        text="Pequenos ajustes para a sua experiência no UniGames."
      />
      <section className="panel preferences-panel">
        <div className="setting-row">
          <div>
            <h2>Reduzir animações</h2>
            <p>Deixa as transições da interface mais discretas.</p>
          </div>
          <label className="switch">
            <input
              aria-label="Reduzir animações"
              type="checkbox"
              checked={reduce}
              onChange={(e) => toggle(e.target.checked)}
            />
            <span />
          </label>
        </div>
        <div className="setting-row">
          <div>
            <h2>Seus favoritos</h2>
            <p>A lista é salva neste navegador e separada por conta.</p>
          </div>
          <Icon name="heart" size={24} />
        </div>
        {config.source === 'demo' && (
          <div className="setting-row">
            <div>
              <h2>Recomeçar a demonstração</h2>
              <p>Restaura os jogos, usuários e anúncios ilustrativos neste navegador.</p>
            </div>
            <button className="btn secondary small" onClick={() => setReset(true)}>
              Restaurar
            </button>
          </div>
        )}
      </section>
      <ConfirmDialog
        open={reset}
        title="Restaurar demonstração?"
        text="As contas e alterações locais da demonstração serão removidas. Seus favoritos serão mantidos."
        onCancel={() => setReset(false)}
        onConfirm={clearDemo}
        label="Restaurar"
      />
    </>
  );
}
