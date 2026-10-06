# Backend UniGames

As seis entidades têm representação no GraphQL: User, Game, Listing, PriceOffer,
Review e Report. As operações estão separadas em `src/graphql/resolvers/`.

Cadastro, autenticação e perfil ficam em `userService`. Revenda, ofertas e
avaliações usam `domainService`. Os relatórios salvos usam `reportService`.
O relatório pessoal é calculado a partir dos anúncios do usuário.

O servidor carrega `backend/.env` e aguarda a conexão com o MongoDB. Configure
`MONGODB_URI` e `JWT_SECRET` antes de executar `npm start`.

Consulte `../docs/INTEGRACAO.md` e `../docs/VERIFICACAO.md` para operações e testes.
