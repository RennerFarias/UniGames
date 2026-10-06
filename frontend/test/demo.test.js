import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDemoService } from '../src/services/demo.js';
const fixture = () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  let session = null;
  const api = createDemoService(storage, () => session);
  return {
    api,
    storage,
    setUser: (user) => {
      session = user;
    },
  };
};
test('login valida senha e normaliza e-mail; cadastro não armazena senha em texto', async () => {
  const f = fixture();
  await assert.rejects(f.api.login({ email: 'demo@unigames.com', senha: 'incorreta' }));
  const auth = await f.api.register({
    nome: 'Teste',
    email: ' NOVO@EXAMPLE.COM ',
    senha: 'senha-teste-123',
  });
  assert.equal(auth.usuario.email, 'novo@example.com');
  assert(!f.storage.getItem('unigames.demo.v2').includes('senha-teste-123'));
  assert.equal(
    (await f.api.login({ email: 'novo@example.com', senha: 'senha-teste-123' })).usuario.id,
    auth.usuario.id,
  );
});
test('um vendedor não pode editar ou excluir o anúncio de outro', async () => {
  const f = fixture();
  const session = await f.api.register({
    nome: 'Outro jogador',
    email: 'other@example.com',
    senha: 'senha123',
  });
  f.setUser(session.usuario);
  await assert.rejects(
    f.api.saveListing('listing-1', {
      preco: 10,
      estadoConservacao: 'Bom',
      plataforma: 'PlayStation 5',
      contato: { nome: 'Outro', info: 'other@example.com' },
    }),
  );
  await assert.rejects(f.api.deleteListing('listing-1'));
  assert.equal((await f.api.myListings()).length, 0);
});
test('venda declarada aparece no relatório e sai dos anúncios públicos', async () => {
  const f = fixture();
  const auth = await f.api.login({ email: 'demo@unigames.com', senha: 'unigames123' });
  f.setUser(auth.usuario);
  const listing = await f.api.listing('listing-1');
  await f.api.saveListing(listing.id, {
    preco: 135,
    estadoConservacao: listing.estadoConservacao,
    plataforma: listing.plataforma,
    contato: listing.contato,
    status: 'vendido',
  });
  assert.equal(
    (await f.api.listings()).some((l) => l.id === listing.id),
    false,
  );
  const report = await f.api.report();
  assert.equal(report.anunciosVendidos, 2);
  assert.equal(report.valorVendas, 200);
});
test('atualização de oferta preserva os preços anteriores e recalcula o desconto', async () => {
  const f = fixture();
  const auth = await f.api.login({ email: 'admin@unigames.com', senha: 'unigames123' });
  f.setUser(auth.usuario);
  const { offers } = await f.api.catalog();
  const original = offers[0];
  const updated = await f.api.saveOffer(original.id, {
    loja: original.loja,
    preco: 50,
    precoOriginal: 100,
    urlLoja: original.urlLoja,
  });
  assert.equal(updated.discount, 50);
  assert.equal(updated.historicoPrecos.length, original.historicoPrecos.length + 1);
  assert.equal(updated.historicoPrecos.at(-1).preco, 50);
});

test('cadastro preserva a data e ativação de revendedor atualiza a conta local', async () => {
  const f = fixture();
  const auth = await f.api.register({
    nome: 'Revendedor',
    email: 'seller@example.com',
    senha: 'senha123',
    dataNascimento: '2000-01-02',
  });
  f.setUser(auth.usuario);
  const updated = await f.api.tornarRevendedor();
  assert.equal(updated.revendedor, true);
  assert.equal(updated.dataNascimento, '2000-01-02');
  assert.equal((await f.api.me()).revendedor, true);
});

test('revenda rejeita nascimento inválido, futuro ou idade abaixo de 16 anos', async () => {
  const f = fixture();
  const auth = await f.api.register({ nome: 'Conta', email: 'age@example.com', senha: 'senha123' });
  f.setUser(auth.usuario);
  for (const date of ['invalida', '2000-02-30', '2099-01-01', '2020-01-01']) {
    await assert.rejects(f.api.tornarRevendedor(date));
  }
  assert.equal((await f.api.me()).revendedor, false);
});
