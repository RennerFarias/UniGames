import { config, token, authExpired } from './config';
import { Game, PriceOffer, Listing, User, Review, Report } from '../models/entities';
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${config.apiUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token() && { Authorization: `Bearer ${token()}` }),
        ...options.headers,
      },
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Confira se o backend está rodando e se a URL está correta.',
    );
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/auth')) authExpired();
    throw new Error(data.mensagem || data.error || data.erro || `Erro HTTP ${response.status}`);
  }
  return data;
}
const reportType = (tipo) => tipo?.toLowerCase();
const send = (path, method, data) => request(path, { method, body: JSON.stringify(data) });
async function pages(path, key) {
  let page = 1;
  let last = 1;
  const rows = [];
  do {
    const d = await request(`${path}${path.includes('?') ? '&' : '?'}pagina=${page}&limite=100`);
    rows.push(...(d[key] || []));
    last = d.paginacao?.paginas || 1;
    page++;
  } while (page <= last);
  return rows;
}
export const restService = {
  async catalog() {
    const [games, offers] = await Promise.all([pages('/jogos', 'jogos'), request('/ofertas')]);
    return {
      games: games.map((g) => new Game(g)),
      offers: offers.ofertas.map((o) => new PriceOffer(o)),
    };
  },
  async game(id) {
    const [g, h, r] = await Promise.all([
      request(`/jogos/${id}`),
      request(`/relatorios/historico-precos/${id}`).catch((error) => {
        if (/Nenhum histórico/.test(error.message)) return { ofertas: [] };
        throw error;
      }),
      request(`/avaliacoes?jogoId=${id}`),
    ]);
    return {
      game: new Game(g.jogo),
      offers: h.ofertas.map((o) => new PriceOffer(o)),
      reviews: r.avaliacoes.map((v) => new Review(v)),
    };
  },
  async listings() {
    return (await pages('/anuncios', 'anuncios')).map((l) => new Listing(l));
  },
  async listing(id) {
    return new Listing((await request(`/anuncios/${id}`)).anuncio);
  },
  async myListings() {
    return (await request('/anuncios/meus')).anuncios.map((l) => new Listing(l));
  },
  async login(input) {
    const d = await send('/auth/login', 'POST', input);
    return { ...d, usuario: new User(d.usuario) };
  },
  async register(input) {
    await send('/auth/cadastro', 'POST', input);
    return this.login({ email: input.email, senha: input.senha });
  },
  async me() {
    return new User((await request('/usuarios/perfil')).usuario);
  },
  async updateProfile(input) {
    return new User((await send('/usuarios/perfil', 'PUT', input)).usuario);
  },
  async tornarRevendedor(dataNascimento) {
    return new User((await send('/usuarios/revendedor', 'POST', { dataNascimento })).usuario);
  },
  async publicUser(id) {
    return new User((await request('/usuarios/' + id)).usuario);
  },
  async reviews(filter = {}) {
    const query = new URLSearchParams(Object.entries(filter).filter(([, value]) => value != null));
    return (await request('/avaliacoes?' + query)).avaliacoes.map((row) => new Review(row));
  },
  async updateReview(id, input) {
    return new Review((await send('/avaliacoes/' + id, 'PUT', input)).avaliacao);
  },
  async deleteReview(id) {
    await request('/avaliacoes/' + id, { method: 'DELETE' });
    return true;
  },
  async deleteOffer(id) {
    await request('/ofertas/' + id, { method: 'DELETE' });
    return true;
  },
  async savedReports(tipo) {
    return (
      await request('/relatorios/salvos' + (tipo ? '?tipo=' + reportType(tipo) : ''))
    ).relatorios.map((row) => new Report(row));
  },
  async savedReport(id) {
    return new Report((await request('/relatorios/salvos/' + id)).relatorio);
  },
  async generateReport(tipo, descricao) {
    return new Report(
      (await send('/relatorios/salvos', 'POST', { tipo: reportType(tipo), descricao })).relatorio,
    );
  },
  async deleteReport(id) {
    await request('/relatorios/salvos/' + id, { method: 'DELETE' });
    return true;
  },
  async saveListing(id, input) {
    const { jogoId, ...fields } = input;
    return new Listing(
      (
        await send(
          id ? `/anuncios/${id}` : '/anuncios',
          id ? 'PUT' : 'POST',
          id ? fields : { ...fields, jogo: jogoId },
        )
      ).anuncio,
    );
  },
  async deleteListing(id) {
    await request(`/anuncios/${id}`, { method: 'DELETE' });
    return true;
  },
  async createReview(input) {
    return new Review((await send('/avaliacoes', 'POST', input)).avaliacao);
  },
  async report() {
    return new Report((await request('/relatorios/minha-atividade')).relatorio);
  },
  async saveGame(id, input) {
    return new Game((await send(id ? `/jogos/${id}` : '/jogos', id ? 'PUT' : 'POST', input)).jogo);
  },
  async deleteGame(id) {
    await request(`/jogos/${id}`, { method: 'DELETE' });
    return true;
  },
  async saveOffer(id, input) {
    return new PriceOffer(
      (await send(id ? `/ofertas/${id}` : '/ofertas', id ? 'PUT' : 'POST', input)).oferta,
    );
  },
  async deleteUser(id) {
    await request(`/usuarios/${id}`, { method: 'DELETE' });
    return true;
  },
  async users() {
    return (await request('/usuarios')).usuarios.map((u) => new User(u));
  },
};
