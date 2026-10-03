# Contratos de integração

O adaptador é escolhido por `VITE_DATA_SOURCE` em `frontend/.env`. Os componentes recebem as mesmas entidades independentemente do transporte. Em GraphQL, as operações ficam em `src/graphql/queries.js` e `mutations.js`, com variáveis tipadas e fragments compartilhados. Em REST, o adaptador normaliza os envelopes JSON e percorre a paginação do catálogo e dos anúncios.

| Fluxo | GraphQL | REST real do projeto |
| --- | --- | --- |
| Cadastro | `register` | `POST /auth/cadastro`, seguido de login |
| Login | `login` | `POST /auth/login` |
| Meu perfil | `me`, `updateProfile` | `GET/PUT /usuarios/perfil` |
| Catálogo | `getGames`, `getPriceOffers` | `GET /jogos`, `GET /ofertas` |
| Detalhes | `getGame`, `getPriceHistory`, `getReviews` | `GET /jogos/:id`, `/relatorios/historico-precos/:id`, `/avaliacoes?jogoId=:id` |
| Revenda pública | `getListings`, `getListing` | `GET /anuncios`, `GET /anuncios/:id` |
| Meus anúncios | `getMyListings` | `GET /anuncios/meus` |
| Criar/editar/excluir anúncio | `createListing`, `updateListing`, `deleteListing` | `POST /anuncios`, `PUT/DELETE /anuncios/:id` |
| Relatório pessoal | `getMyReport` | `GET /relatorios/minha-atividade` |
| Avaliação de jogo | `createReview` | `POST /avaliacoes` |
| Gerenciar jogos | `createGame`, `updateGame`, `deleteGame` | `POST /jogos`, `PUT/DELETE /jogos/:id` |
| Criar/atualizar oferta | `createPriceOffer`, `updatePriceOffer` | `POST /ofertas`, `PUT /ofertas/:id` |
| Administrar usuários | `getUsers`, `deleteUser` | `GET /usuarios`, `DELETE /usuarios/:id` |

O documento de escopo usava `/auth/register` e `/revendas`; os arquivos do projeto usam `/auth/cadastro` e `/anuncios`. A integração usa as rotas que existem no código.

## Mudanças necessárias no backend

- `Listing`: `vendedor`, `status` (`ativo`, `pausado`, `vendido`) e `vendidoEm`.
- `User`: `foto` opcional; e-mail normalizado.
- GraphQL: campos acima, `getMyListings`, `getMyReport` e `updatePriceOffer`.
- REST: ofertas, avaliações, anúncios pessoais e relatório pessoal.
- `domainService`: vendedor autenticado é vinculado na criação, alterações exigem proprietário/admin, vendas declaradas geram a data, atualização de preço acrescenta o histórico.
- Jogos e usuários com registros vinculados não são excluídos pelo painel.
- JWT é conferido e o usuário atual é consultado; um token de usuário removido deixa de autorizar ações.

As duas interfaces aplicam essas regras. Não há envio de e-mail, integrações de pagamento, compra automática ou sincronização externa de preços.

## Acrescentar uma API externa depois

A tela não precisa conhecer detalhes de uma loja. A integração externa deve acontecer no backend: consulte a fonte escolhida, normalize jogo/loja/preço/URL e crie ou atualize `PriceOffer`. Depois, o front passa a exibir os novos dados e o histórico normalmente. Chaves privadas devem ficar no backend; variáveis `VITE_*` são públicas e entram no código entregue ao navegador.

Referência da autenticação Apollo usada: https://www.apollographql.com/docs/react/networking/authentication
