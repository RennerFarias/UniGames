# Operações de integração

As telas usam o objeto `api`. Ele escolhe o adaptador configurado em
`VITE_DATA_SOURCE`. GraphQL e REST compartilham as regras de cadastro, perfil,
revenda, ofertas e avaliações no backend.

| Recurso | GraphQL | REST |
| --- | --- | --- |
| Cadastro e login | `register`, `login` | `POST /auth/cadastro`, `POST /auth/login` |
| Meu perfil | `me`, `updateProfile` | `GET/PUT /usuarios/perfil` |
| Perfil público | `getUser` | `GET /usuarios/:id` |
| Ativar revenda | `tornarRevendedor` | `POST /usuarios/revendedor` |
| Administrar usuários | `getUsers`, `deleteUser` | `GET /usuarios`, `DELETE /usuarios/:id` |
| Catálogo | `getGames`, `getGame` | `GET /jogos`, `GET /jogos/:id` |
| Gerenciar jogos | `createGame`, `updateGame`, `deleteGame` | `POST /jogos`, `PUT/DELETE /jogos/:id` |
| Revenda pública | `getListings`, `getListing` | `GET /anuncios`, `GET /anuncios/:id` |
| Meus anúncios | `getMyListings` | `GET /anuncios/meus` |
| Gerenciar anúncios | `createListing`, `updateListing`, `deleteListing` | `POST /anuncios`, `PUT/DELETE /anuncios/:id` |
| Ofertas | `getPriceOffers`, `getFeaturedOffers`, `getPriceHistory` | `GET /ofertas`, `GET /relatorios/ofertas-destaque`, `GET /relatorios/historico-precos/:jogoId` |
| Gerenciar ofertas | `createPriceOffer`, `updatePriceOffer`, `deletePriceOffer` | `POST /ofertas`, `PUT/DELETE /ofertas/:id` |
| Avaliações | `getReviews`, `createReview`, `updateReview`, `deleteReview` | `GET/POST /avaliacoes`, `PUT/DELETE /avaliacoes/:id` |
| Atividade pessoal | `getMyReport` | `GET /relatorios/minha-atividade` |
| Relatórios salvos | `getReports`, `getReport`, `generateReport`, `deleteReport` | `GET/POST /relatorios/salvos`, `GET/DELETE /relatorios/salvos/:id` |

## Tipos de relatório

| GraphQL | Valor armazenado no MongoDB e usado no REST | Dados gerados |
| --- | --- | --- |
| `ATIVIDADE_USUARIOS` | `atividade_usuarios` | Total de usuários e anúncios agrupados por status |
| `OFERTAS_DESTAQUE` | `ofertas_destaque` | Até 10 ofertas ordenadas por desconto |
| `VARIACAO_PRECOS` | `variacao_precos` | Histórico registrado das ofertas |
| `BUSCAS_FREQUENTES` | `buscas_frequentes` | Geração indisponível: falta registrar as pesquisas |

Os relatórios salvos são snapshots do momento da geração e exigem administrador.
O relatório pessoal é calculado no momento da consulta e mostra os anúncios da
conta autenticada.

## Regras principais

- O usuário precisa ativar a revenda e ter pelo menos 16 anos para anunciar.
- O vendedor vem do token validado pelo backend, sem aceitar um vendedor informado pelo formulário.
- O proprietário ou um administrador pode alterar e excluir um anúncio.
- Anúncios pausados e vendidos ficam visíveis ao proprietário e ao administrador.
- Perfil público, vendedores e autores de avaliações usam `PublicUser`, sem e-mail e data de nascimento.
- A avaliação tem um único alvo: jogo ou usuário. A nota vai de 1 a 5.
- O autor ou um administrador pode editar e excluir uma avaliação.
- Administradores gerenciam jogos, ofertas, usuários e relatórios salvos.
- A mudança de preço acrescenta uma entrada ao histórico e recalcula o desconto.
- Jogos e usuários com registros vinculados têm a exclusão bloqueada.
- Datas e horários são retornados em ISO 8601 pelo scalar `DateTime`. Nascimento usa `AAAA-MM-DD`.

As queries `getGames` e `getListings` também aceitam filtros no schema.
As telas já mantêm seus próprios filtros de apresentação.

As novas operações de avaliação, exclusão de oferta e relatórios salvos estão
disponíveis na API e no adaptador GraphQL. Não foi criada uma tela adicional
para cada operação. O modo demo mantém os fluxos de apresentação existentes,
incluindo ativação de revendedor.

## APIs externas

Para integrar uma loja, a consulta externa deve acontecer no backend. Depois,
os resultados podem ser normalizados e gravados em `PriceOffer`. As telas
já leem essas ofertas. Chaves privadas não devem entrar em variáveis `VITE_*`,
pois elas são enviadas ao navegador.

O documento inicial citava `/auth/register` e `/revendas`. Os endpoints em uso
no código são `/auth/cadastro` e `/anuncios`.
