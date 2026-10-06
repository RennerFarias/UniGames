import { parseBirthDate, ageOnDate } from '../utils/birthDate.js';
import { createDemoData } from '../data/catalog.js';
import { Game, Listing, PriceOffer, Review, User, Report, idOf } from '../models/entities.js';
const KEY = 'unigames.demo.v2';
const clone = (value) => structuredClone(value);
const now = () => new Date().toISOString();
const fail = (message) => {
  throw new Error(message);
};
const hash = async (text) =>
  Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

export function createDemoService(storage, currentUser) {
  let data;
  try {
    data = JSON.parse(storage.getItem(KEY));
  } catch {
    data = null;
  }
  if (!data?.games) data = createDemoData();
  for (const row of data.users) {
    if (row.revendedor === undefined) {
      row.revendedor =
        row.perfil === 'admin' || data.listings.some((listing) => listing.vendedor === row.id);
    }
  }
  const save = () => storage.setItem(KEY, JSON.stringify(data));
  const user = () => currentUser() || fail('Entre na sua conta para continuar.');
  const admin = () =>
    user().perfil === 'admin' || fail('Apenas administradores podem gerenciar o catálogo.');
  const populateOffer = (offer) =>
    new PriceOffer({ ...clone(offer), jogo: data.games.find((g) => g.id === offer.jogo) });
  const populateListing = (listing) =>
    new Listing({
      ...clone(listing),
      jogo: data.games.find((g) => g.id === listing.jogo),
      vendedor: data.users.find((u) => u.id === listing.vendedor) || {
        id: listing.vendedor,
        nome: listing.contato.nome,
        perfil: 'usuario',
      },
    });
  const owned = (id) => {
    const row = data.listings.find((l) => l.id === id) || fail('Anúncio não encontrado.');
    if (row.vendedor !== user().id && user().perfil !== 'admin')
      fail('Você só pode alterar seus próprios anúncios.');
    return row;
  };
  const listingInput = (input) => {
    if (!Number.isFinite(input.preco) || input.preco < 0) fail('Informe um preço válido.');
    if (!['Novo', 'Excelente', 'Bom', 'Marcas de Uso'].includes(input.estadoConservacao))
      fail('Estado de conservação inválido.');
    if (!input.plataforma || !input.contato?.nome?.trim() || !input.contato?.info?.trim())
      fail('Preencha a plataforma e o contato.');
    if (input.status && !['ativo', 'vendido', 'pausado'].includes(input.status))
      fail('Status inválido.');
  };
  const service = {
    async catalog() {
      return {
        games: data.games.map((g) => new Game(clone(g))),
        offers: data.offers.map(populateOffer),
      };
    },
    async game(id) {
      return {
        game: new Game(clone(data.games.find((g) => g.id === id) || fail('Jogo não encontrado.'))),
        offers: data.offers.filter((o) => o.jogo === id).map(populateOffer),
        reviews: data.reviews.filter((r) => r.jogo === id).map((r) => new Review(clone(r))),
      };
    },
    async listings() {
      return data.listings.filter((l) => l.status === 'ativo').map(populateListing);
    },
    async listing(id) {
      return populateListing(
        data.listings.find((l) => l.id === id) || fail('Anúncio não encontrado.'),
      );
    },
    async myListings() {
      return data.listings.filter((l) => l.vendedor === user().id).map(populateListing);
    },
    async login(input) {
      const email = input.email.trim().toLowerCase();
      let row = data.users.find((u) => u.email === email);
      if (email === 'admin@unigames.com' && input.senha === 'unigames123' && !row) {
        row = {
          id: 'demo-admin',
          nome: 'Admin UniGames',
          email,
          perfil: 'admin',
          createdAt: now(),
        };
        data.users.push(row);
        save();
      }
      const seeded =
        ['demo@unigames.com', 'admin@unigames.com'].includes(email) &&
        !row?.passwordHash &&
        input.senha === 'unigames123';
      if (!row || (!seeded && row.passwordHash !== (await hash(input.senha))))
        fail('E-mail ou senha inválidos.');
      return { token: `demo:${row.id}`, usuario: new User(clone(row)) };
    },
    async register(input) {
      const email = input.email.trim().toLowerCase();
      if (!input.nome.trim() || input.senha.length < 6)
        fail('Informe seu nome e uma senha com pelo menos 6 caracteres.');
      if (data.users.some((u) => u.email === email)) fail('Este e-mail já está cadastrado.');
      const row = {
        id: crypto.randomUUID(),
        nome: input.nome.trim(),
        email,
        perfil: 'usuario',
        revendedor: false,
        dataNascimento: input.dataNascimento
          ? parseBirthDate(input.dataNascimento).toISOString().slice(0, 10)
          : undefined,
        passwordHash: await hash(input.senha),
        createdAt: now(),
      };
      data.users.push(row);
      save();
      return { token: `demo:${row.id}`, usuario: new User(clone(row)) };
    },
    async me() {
      return new User(
        clone(data.users.find((u) => u.id === user().id) || fail('Sessão inválida.')),
      );
    },
    async updateProfile(input) {
      const row = data.users.find((u) => u.id === user().id);
      const email = input.email?.trim().toLowerCase();
      if (email && data.users.some((u) => u.id !== row.id && u.email === email))
        fail('Este e-mail já está cadastrado.');
      if (input.nome !== undefined) row.nome = input.nome.trim() || fail('Informe seu nome.');
      if (email) row.email = email;
      if (input.dataNascimento !== undefined) {
        const nascimento = parseBirthDate(input.dataNascimento);
        if (row.revendedor && ageOnDate(nascimento) < 16)
          fail('Revendedores precisam ter pelo menos 16 anos.');
        row.dataNascimento = nascimento.toISOString().slice(0, 10);
      }
      if (input.foto !== undefined) row.foto = input.foto.trim();
      if (input.senha) {
        if (input.senha.length < 6) fail('A senha deve ter pelo menos 6 caracteres.');
        row.passwordHash = await hash(input.senha);
      }
      save();
      return new User(clone(row));
    },
    async tornarRevendedor(dataNascimento) {
      const row = data.users.find((item) => item.id === user().id) || fail('Sessão inválida.');
      if (row.revendedor) return new User(clone(row));
      const nascimento = parseBirthDate(dataNascimento || row.dataNascimento);
      if (ageOnDate(nascimento) < 16)
        fail('Você precisa ter pelo menos 16 anos para se tornar um revendedor.');
      row.dataNascimento = nascimento.toISOString().slice(0, 10);
      row.revendedor = true;
      save();
      return new User(clone(row));
    },
    async saveListing(id, input) {
      listingInput(input);
      let row;
      if (id) {
        row = owned(id);
        Object.assign(row, clone(input));
      } else {
        if (!user().revendedor && user().perfil !== 'admin')
          fail('Ative sua conta de revendedor para anunciar.');
        if (!data.games.some((g) => g.id === input.jogoId)) fail('Selecione um jogo do catálogo.');
        const { jogoId, ...fields } = input;
        row = {
          ...clone(fields),
          id: crypto.randomUUID(),
          jogo: jogoId,
          vendedor: user().id,
          status: 'ativo',
          createdAt: now(),
        };
        data.listings.unshift(row);
      }
      if (row.status === 'vendido') row.vendidoEm ||= now();
      else row.vendidoEm = null;
      row.updatedAt = now();
      save();
      return populateListing(row);
    },
    async deleteListing(id) {
      owned(id);
      data.listings = data.listings.filter((l) => l.id !== id);
      save();
      return true;
    },
    async createReview(input) {
      if (!Number.isInteger(input.nota) || input.nota < 1 || input.nota > 5)
        fail('Escolha uma nota de 1 a 5.');
      const row = {
        ...clone(input),
        jogo: input.jogoId,
        avaliador: new User(user()),
        id: crypto.randomUUID(),
        createdAt: now(),
      };
      data.reviews.unshift(row);
      save();
      return new Review(row);
    },
    async report() {
      const mine = data.listings.filter((l) => l.vendedor === user().id);
      const sold = mine.filter((l) => l.status === 'vendido');
      const counts = {};
      mine.forEach((l) => (counts[l.plataforma] = (counts[l.plataforma] || 0) + 1));
      return new Report({
        totalAnuncios: mine.length,
        anunciosAtivos: mine.filter((l) => l.status === 'ativo').length,
        anunciosVendidos: sold.length,
        valorVendas: sold.reduce((n, l) => n + l.preco, 0),
        porPlataforma: Object.entries(counts).map(([plataforma, quantidade]) => ({
          plataforma,
          quantidade,
        })),
      });
    },
    async saveGame(id, input) {
      admin();
      if (!input.titulo.trim()) fail('Informe o título.');
      let row;
      if (id) {
        row = data.games.find((g) => g.id === id) || fail('Jogo não encontrado.');
        Object.assign(row, clone(input));
      } else {
        row = { ...clone(input), id: crypto.randomUUID(), createdAt: now() };
        data.games.push(row);
      }
      row.updatedAt = now();
      save();
      return new Game(clone(row));
    },
    async deleteGame(id) {
      admin();
      if (data.listings.some((l) => l.jogo === id) || data.offers.some((o) => o.jogo === id))
        fail('Remova as referências a este jogo antes de excluí-lo.');
      data.games = data.games.filter((g) => g.id !== id);
      save();
      return true;
    },
    async saveOffer(id, input) {
      admin();
      if (!Number.isFinite(input.preco) || input.preco < 0 || !input.loja.trim())
        fail('Informe a loja e um preço válido.');
      let row;
      if (id) {
        row = data.offers.find((o) => o.id === id) || fail('Oferta não encontrada.');
        Object.assign(row, clone(input));
      } else {
        const { jogoId, ...rest } = input;
        if (!data.games.some((g) => g.id === jogoId)) fail('Jogo não encontrado.');
        row = { ...clone(rest), jogo: jogoId, id: crypto.randomUUID(), historicoPrecos: [] };
        data.offers.push(row);
      }
      row.descontoPercentual =
        row.precoOriginal > row.preco ? Math.round((1 - row.preco / row.precoOriginal) * 100) : 0;
      row.historicoPrecos.push({ preco: row.preco, data: now() });
      row.updatedAt = now();
      save();
      return populateOffer(row);
    },
    async deleteUser(id) {
      admin();
      if (id === user().id) fail('Você não pode excluir sua própria conta.');
      if (
        data.listings.some((l) => l.vendedor === id) ||
        data.reviews.some((r) => idOf(r.avaliador) === id)
      )
        fail('Usuário possui registros vinculados.');
      data.users = data.users.filter((u) => u.id !== id);
      save();
      return true;
    },
    async users() {
      admin();
      return data.users.map((u) => new User(clone(u)));
    },
    reset() {
      storage.removeItem(KEY);
    },
  };
  return service;
}
