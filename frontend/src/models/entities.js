const idOf = (value) =>
  typeof value === 'object' && value ? String(value.id || value._id || '') : String(value || '');
export { idOf };
export function parseDate(value) {
  if (!value) return null;
  const date = new Date(/^\d+$/.test(String(value)) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
}
export class User {
  constructor(data = {}) {
    Object.assign(this, data, { id: idOf(data), revendedor: Boolean(data.revendedor) });
    delete this.senha;
    delete this.passwordHash;
  }
  get isAdmin() {
    return this.perfil === 'admin';
  }
}
export class Game {
  constructor(data = {}) {
    Object.assign(this, data, {
      id: idOf(data),
      generos: data.generos || [],
      plataformas: data.plataformas || [],
      linksReferencia: data.linksReferencia || [],
    });
  }
}
export class PriceOffer {
  constructor(data = {}) {
    Object.assign(this, data, {
      id: idOf(data),
      jogo: data.jogo && typeof data.jogo === 'object' ? new Game(data.jogo) : data.jogo,
      preco: Number(data.preco),
      historicoPrecos: data.historicoPrecos || [],
    });
  }
  get discount() {
    return this.precoOriginal > this.preco
      ? Math.round((1 - this.preco / this.precoOriginal) * 100)
      : 0;
  }
}
export class Listing {
  constructor(data = {}) {
    Object.assign(this, data, {
      id: idOf(data),
      jogo: data.jogo && typeof data.jogo === 'object' ? new Game(data.jogo) : data.jogo,
      vendedor:
        data.vendedor && typeof data.vendedor === 'object'
          ? new User(data.vendedor)
          : data.vendedor,
      preco: Number(data.preco),
      status: data.status || 'ativo',
    });
  }
}
export class Review {
  constructor(data = {}) {
    Object.assign(this, data, {
      id: idOf(data),
      avaliador: data.avaliador && new User(data.avaliador),
      avaliadoUser: data.avaliadoUser && new User(data.avaliadoUser),
      jogo: data.jogo && typeof data.jogo === 'object' ? new Game(data.jogo) : data.jogo,
      nota: Number(data.nota),
    });
  }
}
export class Report {
  constructor(data = {}) {
    Object.assign(this, data, {
      id: idOf(data),
      ...(data.tipo && { tipo: data.tipo.toUpperCase() }),
    });
  }
}
