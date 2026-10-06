import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import AccountNav from '../components/AccountNav';
import PageTitle from '../components/PageTitle';
import Icon from '../components/Icon';
import { safeUrl } from '../utils/format';
export default function Perfil() {
  const { user, api, updateUser, logout, notify, wishlist } = useApp();
  const [form, setForm] = useState({
    nome: user.nome,
    email: user.email,
    foto: user.foto || '',
    senha: '',
    confirm: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  async function submit(e) {
    e.preventDefault();
    setError('');
    if (form.senha && form.senha !== form.confirm) {
      setError('As novas senhas precisam ser iguais.');
      return;
    }
    setBusy(true);
    try {
      const updated = await api.updateProfile({
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        foto: form.foto.trim(),
        ...(form.senha && { senha: form.senha }),
      });
      updateUser(updated);
      setForm((f) => ({ ...f, senha: '', confirm: '' }));
      notify('Seu perfil foi atualizado!');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageTitle
        eyebrow="SEU ESPAÇO NO UNIGAMES"
        title={`Olá, ${user.nome.split(' ')[0]}.`}
        text="Suas escolhas, sua coleção e sua próxima aventura."
      />
      <AccountNav />
      <div className="profile-layout">
        <aside className="panel profile-summary">
          <span className="profile-avatar">
            {safeUrl(user.foto) ? (
              <img src={safeUrl(user.foto)} alt="Sua foto de perfil" />
            ) : (
              user.nome.charAt(0)
            )}
          </span>
          <h2>{user.nome}</h2>
          <p>{user.email}</p>
          <span className="role-label">
            {user.perfil === 'admin' ? 'Administrador' : 'Jogador da comunidade'}
          </span>
          <hr />
          <Link to="/favoritos" className="profile-stat">
            <Icon name="heart" size={18} />
            <span>Jogos favoritos</span>
            <strong>{wishlist.length}</strong>
          </Link>
          <Link to="/meus-anuncios" className="text-link">
            <Icon name="store" size={18} />
            Gerenciar meus anúncios <Icon name="arrow" size={15} />
          </Link>
          <hr />
          <button
            className="btn secondary full"
            onClick={() => {
              logout();
              notify('Você saiu da sua conta.');
            }}
          >
            <Icon name="logout" size={16} />
            Sair da conta
          </button>
        </aside>
        <form className="panel form" onSubmit={submit}>
          <h2>Informações do perfil</h2>
          <p className="muted">Mantenha seus dados atualizados.</p>
          <div className="form-row">
            <label>
              Nome
              <input
                name="nome"
                autoComplete="name"
                required
                maxLength="80"
                value={form.nome}
                onChange={set}
              />
            </label>
            <label>
              E-mail
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength="150"
                value={form.email}
                onChange={set}
              />
            </label>
          </div>
          <label>
            URL da foto de perfil (opcional)
            <input
              name="foto"
              type="url"
              value={form.foto}
              onChange={set}
              placeholder="https://..."
            />
          </label>
          <hr />
          <h3>Alterar senha</h3>
          <p className="small-note">Deixe os campos vazios para manter sua senha atual.</p>
          <div className="form-row">
            <label>
              Nova senha
              <input
                name="senha"
                type="password"
                autoComplete="new-password"
                minLength="6"
                maxLength="128"
                value={form.senha}
                onChange={set}
              />
            </label>
            <label>
              Confirmar nova senha
              <input
                name="confirm"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={set}
              />
            </label>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <button
              type="button"
              className="btn secondary mobile-logout"
              onClick={() => {
                logout();
                notify('Você saiu da sua conta.');
              }}
            >
              <Icon name="logout" size={16} />
              Sair da conta
            </button>
            <button className="btn primary" disabled={busy}>
              {busy ? 'Salvando…' : 'Salvar alterações'}
              <Icon name="check" size={17} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
