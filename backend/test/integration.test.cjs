const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

test(
  'GraphQL e REST com MongoDB local de teste',
  {
    skip: !process.env.TEST_MONGODB_URI && 'Defina TEST_MONGODB_URI para executar a integração.',
  },
  async (t) => {
    const uri = new URL(process.env.TEST_MONGODB_URI);
    assert.equal(uri.protocol, 'mongodb:');
    assert(
      ['127.0.0.1', 'localhost'].includes(uri.hostname),
      'Use somente um MongoDB local de teste.',
    );
    assert(uri.pathname.startsWith('/unigames_test_'), 'O banco deve começar com unigames_test_.');

    process.env.MONGODB_URI = uri.toString();
    process.env.JWT_SECRET = 'chave-exclusiva-dos-testes-locais';
    await mongoose.connect(process.env.MONGODB_URI);

    const User = require('../src/models/User');
    const { criarAplicacao } = require('../src/server');
    const server = await criarAplicacao();
    await new Promise((resolve) => server.httpServer.listen(0, '127.0.0.1', resolve));
    const base = 'http://127.0.0.1:' + server.httpServer.address().port;

    t.after(async () => {
      await server.apolloServer.stop();
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    });

    const graphql = async (query, variables = {}, token) => {
      const response = await fetch(base + '/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token }),
        },
        body: JSON.stringify({ query, variables }),
      });
      return response.json();
    };
    const data = async (query, variables, token) => {
      const result = await graphql(query, variables, token);
      assert.equal(result.errors, undefined, JSON.stringify(result.errors));
      return result.data;
    };
    const rejected = async (query, variables, token, code) => {
      const result = await graphql(query, variables, token);
      assert.equal(result.errors?.[0]?.extensions?.code, code, JSON.stringify(result));
    };
    const rest = async (path, method = 'GET', body, token) => {
      const response = await fetch(base + path, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token }),
        },
        ...(body && { body: JSON.stringify(body) }),
      });
      return { status: response.status, body: await response.json() };
    };

    const register =
      'mutation($input:RegisterInput!){register(input:$input){token usuario{id nome email revendedor dataNascimento createdAt}}}';
    const login = 'mutation($input:LoginInput!){login(input:$input){token usuario{id perfil}}}';
    const promote =
      'mutation($date:String){tornarRevendedor(dataNascimento:$date){id revendedor dataNascimento}}';
    const createGame = 'mutation($input:CreateGameInput!){createGame(input:$input){id titulo}}';
    const createListing =
      'mutation($input:CreateListingInput!){createListing(input:$input){id status preco vendedor{id nome foto perfil revendedor createdAt} jogo{id titulo}}}';
    const updateListing =
      'mutation($id:ID!,$input:UpdateListingInput!){updateListing(id:$id,input:$input){id status vendidoEm preco}}';
    const listingQuery =
      'query($id:ID!){getListing(id:$id){id status vendedor{id nome perfil foto revendedor createdAt}}}';
    let seller;
    let other;
    let admin;
    let gameId;
    let listingId;
    let offerId;
    let reviewId;

    await t.test('cadastro, hash de senha, login e sessão autenticada', async () => {
      seller = (
        await data(register, {
          input: {
            nome: 'Vendedor de teste',
            email: ' VENDEDOR@EXAMPLE.COM ',
            senha: 'senha-teste-123',
          },
        })
      ).register;
      other = (
        await data(register, {
          input: {
            nome: 'Outro jogador',
            email: 'outro@example.com',
            senha: 'senha-teste-123',
          },
        })
      ).register;
      const persisted = await User.findById(seller.usuario.id);
      assert.notEqual(persisted.senha, 'senha-teste-123');
      assert(await bcrypt.compare('senha-teste-123', persisted.senha));
      assert.equal(seller.usuario.email, 'vendedor@example.com');
      assert.equal(seller.usuario.revendedor, false);
      assert.match(seller.usuario.createdAt, /^\d{4}-\d{2}-\d{2}T/);
      await rejected(
        login,
        { input: { email: 'vendedor@example.com', senha: 'errada' } },
        null,
        'INVALID_CREDENTIALS',
      );
      await rejected('query{me{id}}', {}, null, 'UNAUTHENTICATED');
      assert.equal((await data('query{me{id}}', {}, seller.token)).me.id, seller.usuario.id);
      await rejected(
        register,
        { input: { nome: 'Duplicado', email: 'vendedor@example.com', senha: 'senha123' } },
        null,
        'BAD_USER_INPUT',
      );
      await rejected(
        register,
        {
          input: {
            nome: 'Data inválida',
            email: 'data@example.com',
            senha: 'senha123',
            dataNascimento: '2000-02-30',
          },
        },
        null,
        'BAD_USER_INPUT',
      );

      const adminRow = await User.create({
        nome: 'Administrador de teste',
        email: 'admin@example.com',
        senha: await bcrypt.hash('senha-teste-123', 10),
        perfil: 'admin',
      });
      admin = (await data(login, { input: { email: adminRow.email, senha: 'senha-teste-123' } }))
        .login;
      assert.equal((await rest('/health')).status, 200);
    });

    await t.test('jogos: permissões, filtros e pesquisa com caracteres especiais', async () => {
      const input = {
        titulo: 'Aventura [Edição {Teste}]',
        generos: ['Aventura'],
        plataformas: ['PC', 'PlayStation 5'],
      };
      await rejected(createGame, { input }, seller.token, 'FORBIDDEN');
      gameId = (await data(createGame, { input }, admin.token)).createGame.id;
      const games = (
        await data('query{getGames(search:"{Teste}",genero:"Aventura",plataforma:"PC"){id}}')
      ).getGames;
      assert.deepEqual(
        games.map((game) => game.id),
        [gameId],
      );
      await rejected(
        'query($id:ID!){getGame(id:$id){id}}',
        { id: 'invalido' },
        null,
        'BAD_USER_INPUT',
      );
    });

    await t.test('revendedor: data real, idade mínima e persistência da ativação', async () => {
      await rejected(promote, { date: 'invalida' }, seller.token, 'BAD_USER_INPUT');
      await rejected(promote, { date: '2099-01-01' }, seller.token, 'BAD_USER_INPUT');
      await rejected(promote, { date: '2020-01-01' }, seller.token, 'FORBIDDEN');
      const activated = (await data(promote, { date: '2000-01-02' }, seller.token))
        .tornarRevendedor;
      assert.equal(activated.revendedor, true);
      assert.equal(activated.dataNascimento, '2000-01-02');
      const profile = (await data('query{me{id revendedor dataNascimento}}', {}, seller.token)).me;
      assert.equal(profile.dataNascimento, '2000-01-02');
      const publicUser = (
        await data('query($id:ID!){getUser(id:$id){id revendedor}}', { id: seller.usuario.id })
      ).getUser;
      assert.equal(publicUser.revendedor, true);
      await rejected(
        'query($id:ID!){getUser(id:$id){email}}',
        { id: seller.usuario.id },
        null,
        'GRAPHQL_VALIDATION_FAILED',
      );
      await rejected('query{getUsers{id email}}', {}, seller.token, 'FORBIDDEN');
      await rejected(
        'mutation($input:UpdateUserInput!){updateProfile(input:$input){id}}',
        { input: { dataNascimento: '2020-01-01' } },
        seller.token,
        'FORBIDDEN',
      );
    });

    await t.test('anúncios: proprietário, vínculos e validação de preço', async () => {
      const input = {
        jogoId: gameId,
        preco: 100,
        estadoConservacao: 'Bom',
        plataforma: 'PlayStation 5',
        contato: { nome: 'Vendedor', info: 'contato@example.com' },
      };
      await rejected(createListing, { input }, other.token, 'FORBIDDEN');
      await rejected(
        createListing,
        { input: { ...input, preco: -1 } },
        seller.token,
        'BAD_USER_INPUT',
      );
      const listing = (await data(createListing, { input }, seller.token)).createListing;
      listingId = listing.id;
      assert.equal(listing.vendedor.id, seller.usuario.id);
      assert.equal(listing.vendedor.revendedor, true);
      assert.equal(listing.jogo.id, gameId);
      await rejected(
        updateListing,
        { id: listingId, input: { preco: 1 } },
        other.token,
        'FORBIDDEN',
      );
      await rejected(
        'mutation($id:ID!){deleteListing(id:$id)}',
        { id: listingId },
        other.token,
        'FORBIDDEN',
      );
    });

    await t.test('anúncios pausados e vendidos: visibilidade e relatório pessoal', async () => {
      await data(updateListing, { id: listingId, input: { status: 'pausado' } }, seller.token);
      await rejected(listingQuery, { id: listingId }, null, 'NOT_FOUND');
      assert.equal(
        (await data(listingQuery, { id: listingId }, seller.token)).getListing.id,
        listingId,
      );
      assert.equal((await rest('/anuncios/' + listingId, 'GET', null, seller.token)).status, 200);
      assert.equal((await rest('/anuncios/' + listingId)).status, 404);
      const sold = (
        await data(updateListing, { id: listingId, input: { status: 'vendido' } }, seller.token)
      ).updateListing;
      assert.match(sold.vendidoEm, /^\d{4}-\d{2}-\d{2}T/);
      assert.equal((await data('query{getListings{id}}')).getListings.length, 0);
      const report = (
        await data(
          'query{getMyReport{totalAnuncios anunciosVendidos valorVendas}}',
          {},
          seller.token,
        )
      ).getMyReport;
      assert.deepEqual(report, { totalAnuncios: 1, anunciosVendidos: 1, valorVendas: 100 });
    });

    await t.test('ofertas: desconto e histórico após alteração do preço', async () => {
      const create =
        'mutation($input:CreatePriceOfferInput!){createPriceOffer(input:$input){id descontoPercentual historicoPrecos{preco data}}}';
      const input = {
        jogoId: gameId,
        loja: 'Loja de teste',
        preco: 100,
        precoOriginal: 200,
        urlLoja: 'https://example.com/jogo',
      };
      await rejected(create, { input }, seller.token, 'FORBIDDEN');
      const offer = (await data(create, { input }, admin.token)).createPriceOffer;
      offerId = offer.id;
      assert.equal(offer.descontoPercentual, 50);
      const updated = (
        await data(
          'mutation($id:ID!,$input:UpdatePriceOfferInput!){updatePriceOffer(id:$id,input:$input){descontoPercentual historicoPrecos{preco data}}}',
          { id: offerId, input: { preco: 80 } },
          admin.token,
        )
      ).updatePriceOffer;
      assert.equal(updated.descontoPercentual, 60);
      assert.deepEqual(
        updated.historicoPrecos.map((point) => point.preco),
        [100, 80],
      );
      assert(updated.historicoPrecos.every((point) => /^\d{4}-\d{2}-\d{2}T/.test(point.data)));
    });

    await t.test('avaliações: um alvo, nota válida e edição pelo autor', async () => {
      const create =
        'mutation($input:CreateReviewInput!){createReview(input:$input){id nota avaliador{id revendedor} jogo{id}}}';
      await rejected(
        create,
        { input: { jogoId: gameId, avaliadoUserId: seller.usuario.id, nota: 5 } },
        other.token,
        'BAD_USER_INPUT',
      );
      await rejected(
        create,
        { input: { avaliadoUserId: other.usuario.id, nota: 5 } },
        other.token,
        'BAD_USER_INPUT',
      );
      await rejected(create, { input: { jogoId: gameId, nota: 0 } }, other.token, 'BAD_USER_INPUT');
      reviewId = (
        await data(
          create,
          { input: { jogoId: gameId, nota: 4, comentario: 'Bom jogo.' } },
          other.token,
        )
      ).createReview.id;
      const update =
        'mutation($id:ID!,$input:UpdateReviewInput!){updateReview(id:$id,input:$input){nota comentario}}';
      await rejected(update, { id: reviewId, input: { nota: 5 } }, seller.token, 'FORBIDDEN');
      const review = (
        await data(
          update,
          { id: reviewId, input: { nota: 5, comentario: 'Atualizado.' } },
          other.token,
        )
      ).updateReview;
      assert.deepEqual(review, { nota: 5, comentario: 'Atualizado.' });
      const reviews = (await rest('/avaliacoes?jogoId=' + gameId)).body.avaliacoes;
      assert.equal(reviews.length, 1);
      assert.equal(reviews[0].avaliador.email, undefined);
      assert.equal(reviews[0].avaliador.senha, undefined);
    });

    await t.test('relatórios salvos: geração real, consulta e permissões', async () => {
      const generate =
        'mutation($tipo:ReportType!){generateReport(tipo:$tipo){id tipo dados createdAt}}';
      await rejected(generate, { tipo: 'ATIVIDADE_USUARIOS' }, seller.token, 'FORBIDDEN');
      const report = (await data(generate, { tipo: 'ATIVIDADE_USUARIOS' }, admin.token))
        .generateReport;
      assert.equal(report.tipo, 'ATIVIDADE_USUARIOS');
      assert.equal(report.dados.totalUsuarios, 3);
      assert.equal(report.dados.totalAnuncios, 1);
      assert.equal(
        (await data('query($id:ID!){getReport(id:$id){id}}', { id: report.id }, admin.token))
          .getReport.id,
        report.id,
      );
      const prices = (await data(generate, { tipo: 'VARIACAO_PRECOS' }, admin.token))
        .generateReport;
      assert.equal(prices.dados[0].historicoPrecos.length, 2);
      const featured = (await data(generate, { tipo: 'OFERTAS_DESTAQUE' }, admin.token))
        .generateReport;
      assert.equal(featured.dados[0].descontoPercentual, 60);
      await rejected(generate, { tipo: 'BUSCAS_FREQUENTES' }, admin.token, 'BAD_USER_INPUT');
      const saved = (await data('query{getReports{ id }}', {}, admin.token)).getReports;
      assert.equal(saved.length, 3);
      for (const row of saved)
        await data('mutation($id:ID!){deleteReport(id:$id)}', { id: row.id }, admin.token);
    });

    await t.test('REST compartilha cadastro, perfil e regras de revenda', async () => {
      const input = {
        nome: 'Conta REST',
        email: 'rest@example.com',
        senha: 'senha-teste-123',
        dataNascimento: '2001-03-04',
      };
      const registered = await rest('/auth/cadastro', 'POST', input);
      assert.equal(registered.status, 201);
      assert.equal(registered.body.usuario.senha, undefined);
      const auth = await rest('/auth/login', 'POST', input);
      assert.equal(auth.status, 200);
      assert.equal(auth.body.usuario.senha, undefined);
      const token = auth.body.token;
      const activated = await rest('/usuarios/revendedor', 'POST', {}, token);
      assert.equal(activated.status, 200);
      assert.equal(activated.body.usuario.revendedor, true);
      const updated = await rest('/usuarios/perfil', 'PUT', { nome: 'Nome atualizado' }, token);
      assert.equal(updated.body.usuario.nome, 'Nome atualizado');
      assert.equal((await rest('/usuarios/perfil')).status, 401);
      await rest('/usuarios/' + auth.body.usuario._id, 'DELETE', null, admin.token);
      assert.equal((await rest('/usuarios/perfil', 'GET', null, token)).status, 401);
    });

    await t.test('exclusões preservam vínculos e respeitam as permissões', async () => {
      await rejected(
        'mutation($id:ID!){deleteGame(id:$id)}',
        { id: gameId },
        admin.token,
        'BAD_USER_INPUT',
      );
      await rejected(
        'mutation($id:ID!){deleteUser(id:$id)}',
        { id: seller.usuario.id },
        admin.token,
        'BAD_USER_INPUT',
      );
      await rejected(
        'mutation($id:ID!){deletePriceOffer(id:$id)}',
        { id: offerId },
        seller.token,
        'FORBIDDEN',
      );
      await rejected(
        'mutation($id:ID!){deleteReview(id:$id)}',
        { id: reviewId },
        seller.token,
        'FORBIDDEN',
      );
      await data('mutation($id:ID!){deleteReview(id:$id)}', { id: reviewId }, other.token);
      await data('mutation($id:ID!){deletePriceOffer(id:$id)}', { id: offerId }, admin.token);
      await data('mutation($id:ID!){deleteListing(id:$id)}', { id: listingId }, seller.token);
      await data('mutation($id:ID!){deleteGame(id:$id)}', { id: gameId }, admin.token);
      await data('mutation($id:ID!){deleteUser(id:$id)}', { id: other.usuario.id }, admin.token);
      await rejected('query{me{id}}', {}, other.token, 'UNAUTHENTICATED');
    });
  },
);
