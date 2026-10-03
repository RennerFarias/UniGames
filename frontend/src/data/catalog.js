// Dados exclusivamente ilustrativos. Não representam preços atuais das lojas.
const definitions = [
  ['elden-ring', 'ELDEN RING', 1245620, ['RPG', 'Mundo aberto'], ['PC', 'PlayStation 5', 'Xbox Series'], 249.90, 149.94, 'Erga-se, Maculado. Explore as Terras Intermédias, descubra seus segredos e escreva sua própria lenda.'],
  ['cyberpunk', 'Cyberpunk 2077', 1091500, ['RPG', 'Ação'], ['PC', 'PlayStation 5', 'Xbox Series'], 199.90, 89.95, 'As ruas de Night City esperam por você. Escolha seu caminho em uma metrópole de possibilidades.'],
  ['god-of-war', 'God of War', 1593500, ['Ação', 'Aventura'], ['PC', 'PlayStation 4'], 199.90, 79.96, 'Uma jornada entre pai e filho pelos reinos da mitologia nórdica.'],
  ['hollow-knight', 'Hollow Knight', 367520, ['Indie', 'Metroidvania'], ['PC', 'Nintendo Switch', 'PlayStation 4'], 46.99, 23.49, 'Desça a um reino esquecido, enfrente criaturas e descubra uma aventura desenhada à mão.'],
  ['red-dead', 'Red Dead Redemption 2', 1174180, ['Ação', 'Mundo aberto'], ['PC', 'PlayStation 4', 'Xbox One'], 299.90, 98.96, 'Viva a história de Arthur Morgan e da gangue Van der Linde no coração do Velho Oeste.'],
  ['hades', 'Hades', 1145360, ['Indie', 'Roguelike'], ['PC', 'Nintendo Switch', 'PlayStation 5'], 73.99, 36.99, 'Desafie o deus dos mortos e escape do submundo nesta aventura que muda a cada tentativa.'],
  ['forza', 'Forza Horizon 5', 1551360, ['Corrida', 'Mundo aberto'], ['PC', 'Xbox Series'], 249.90, 124.95, 'Explore as paisagens do México em um festival de velocidade e liberdade.'],
  ['hogwarts', 'Hogwarts Legacy', 990080, ['RPG', 'Aventura'], ['PC', 'PlayStation 5', 'Xbox Series'], 249.90, 62.47, 'Sua história em Hogwarts começa agora. Explore um mundo mágico no século XIX.'],
  ['baldurs-gate', "Baldur’s Gate 3", 1086940, ['RPG', 'Estratégia'], ['PC', 'PlayStation 5', 'Xbox Series'], 199.99, 159.99, 'Reúna seu grupo. Suas escolhas moldam uma aventura épica nos Reinos Esquecidos.'],
  ['stardew', 'Stardew Valley', 413150, ['Indie', 'Simulação'], ['PC', 'Nintendo Switch', 'PlayStation 4'], 24.99, 14.99, 'Transforme uma antiga fazenda em seu novo lar, faça amigos e descubra a vida no vale.'],
  ['witcher', 'The Witcher 3: Wild Hunt', 292030, ['RPG', 'Mundo aberto'], ['PC', 'PlayStation 5', 'Xbox Series'], 129.99, 32.49, 'Encontre seu destino como Geralt de Rívia em um mundo de monstros e escolhas difíceis.'],
  ['resident-evil', 'Resident Evil 4', 2050650, ['Ação', 'Terror'], ['PC', 'PlayStation 5', 'Xbox Series'], 199.00, 99.50, 'A missão de Leon leva a um vilarejo onde nada é o que parece. Sobreviva ao inesperado.'],
];
export const demoGames = definitions.map(([slug, titulo, appId, generos, plataformas, original, price, descricao], i) => ({
  id: (i + 1).toString(16).padStart(24, '0'), titulo, generos, plataformas, descricao,
  imagemCapa: `/games/${slug}.jpg`, linksReferencia: [`https://store.steampowered.com/app/${appId}/`],
  createdAt: '2026-08-01T12:00:00.000Z', updatedAt: '2026-10-01T12:00:00.000Z', _demo: { slug, appId, original, price },
}));
export function createDemoData() {
  const users = [{ id: 'demo-user', nome: 'Player UniGames', email: 'demo@unigames.com', perfil: 'usuario', createdAt: '2026-09-01T12:00:00Z' }];
  const offers = demoGames.flatMap((game, i) => ['Nuuvem', 'Steam', 'Epic Games'].map((loja, index) => {
    const price = Math.round((game._demo.price + index * (7.5 + i)) * 100) / 100;
    return { id: `offer-${i}-${index}`, jogo: game.id, loja, preco: price, precoOriginal: game._demo.original,
      descontoPercentual: Math.round((1 - price / game._demo.original) * 100), urlLoja: game.linksReferencia[0],
      historicoPrecos: [0.92, 0.84, 0.97, 0.7, 0.8, price / game._demo.original].map((factor, k) => ({ preco: Math.round(game._demo.original * factor * 100) / 100, data: `2026-09-${String(5 + k * 5).padStart(2, '0')}T12:00:00Z` })), updatedAt: '2026-09-30T12:00:00Z',
    };
  }));
  const listings = [
    { id: 'listing-1', jogo: demoGames[0].id, vendedor: 'demo-user', preco: 135, estadoConservacao: 'Excelente', plataforma: 'PlayStation 5', contato: { nome: 'Player UniGames', info: 'demo@unigames.com' }, descricao: 'Mídia física com caixa original. Anúncio de demonstração.', status: 'ativo', createdAt: '2026-09-29T12:00:00Z' },
    { id: 'listing-2', jogo: demoGames[4].id, vendedor: 'community-user', preco: 80, estadoConservacao: 'Bom', plataforma: 'PlayStation 4', contato: { nome: 'Lucas', info: 'lucas@example.com' }, descricao: 'Caixa e disco em bom estado. Anúncio de demonstração.', status: 'ativo', createdAt: '2026-09-27T12:00:00Z' },
    { id: 'listing-3', jogo: demoGames[7].id, vendedor: 'community-user', preco: 120, estadoConservacao: 'Novo', plataforma: 'Xbox Series', contato: { nome: 'Marina', info: 'marina@example.com' }, descricao: 'Jogo lacrado. Anúncio de demonstração.', status: 'ativo', createdAt: '2026-09-25T12:00:00Z' },
    { id: 'listing-4', jogo: demoGames[2].id, vendedor: 'demo-user', preco: 65, estadoConservacao: 'Excelente', plataforma: 'PlayStation 4', contato: { nome: 'Player UniGames', info: 'demo@unigames.com' }, descricao: 'Venda marcada manualmente para demonstrar o relatório.', status: 'vendido', vendidoEm: '2026-09-20T12:00:00Z', createdAt: '2026-09-15T12:00:00Z' },
  ];
  const reviews = [{ id: 'review-1', jogo: demoGames[0].id, avaliador: { id: 'community-user', nome: 'Lucas', perfil: 'usuario' }, nota: 5, comentario: 'Explorar esse mundo com calma faz toda a diferença. Avaliação ilustrativa.', createdAt: '2026-09-25T12:00:00Z' }];
  return { games: demoGames.map(({ _demo, ...game }) => game), offers, listings, users, reviews };
}
