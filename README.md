# UniGames

Uma loja de descoberta e comparação de jogos, com visual azul-marinho inspirado em lojas de games, feita em React + Vite. O projeto inclui o backend Express/Apollo atualizado, seis entidades no front-end e integração com GraphQL ou REST.

## Abrir a demonstração

Requisito: Node.js 22.12 ou superior. Node.js 24 LTS é uma opção compatível.

Depois de extrair o ZIP, abra um terminal na pasta `UniGames`:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Abra `http://localhost:5173`. No Windows, você também pode usar `Iniciar_UniGames.bat`.

O modo padrão é **demo**. Não precisa iniciar o backend ou conectar o MongoDB para ver o front-end. Jogos, ofertas, anúncios e avaliações são exemplos locais. Os preços não representam ofertas atuais; os links de exemplo abrem a página de referência do jogo.

| Conta local de demonstração | E-mail | Senha |
| --- | --- | --- |
| Jogador | demo@unigames.com | unigames123 |
| Administrador | admin@unigames.com | unigames123 |

As duas contas acima existem **somente no modo demo**. Você também pode criar uma conta de demonstração pelo formulário. As alterações ficam no navegador; “Preferências → Restaurar” reinicia os exemplos.

## Conectar com GraphQL

Use o backend que acompanha esta entrega: ele contém os campos e as operações necessários para vendedor, status de anúncios, foto, relatórios e atualização de preços.

1. Copie seu arquivo `.env` atual para `backend/.env`, ou copie `backend/.env.example` e configure `MONGODB_URI` e `JWT_SECRET`. As credenciais do ZIP original não estão incluídas na entrega.
2. Em um terminal separado, dentro de `backend`, execute:

```powershell
npm.cmd ci
npm.cmd start
```

3. Em `frontend/.env`, altere:

```dotenv
VITE_DATA_SOURCE=graphql
VITE_GRAPHQL_URL=http://localhost:3000/graphql
VITE_API_URL=http://localhost:3000
```

4. Reinicie `npm.cmd run dev` no front-end. Cadastre uma conta no backend ou entre com uma conta existente no banco.

O front envia `Authorization: Bearer <JWT>` automaticamente. A sessão fica em `sessionStorage`; o logout limpa a sessão e o cache Apollo. Uma sessão expirada retorna para o login. Uma falha de conexão mostra um erro e permite tentar novamente; não troca automaticamente para dados fictícios.

**GraphQL já é uma API.** Não é preciso usar REST junto para os fluxos implementados. A opção REST está disponível se a disciplina ou o grupo preferir usá-la.

Para REST, use `VITE_DATA_SOURCE=rest` e `VITE_API_URL=http://localhost:3000`. Reinicie o front após mudar qualquer variável.

## Alimentar o catálogo real

O catálogo em GraphQL/REST reflete o conteúdo do MongoDB. O modo demo não grava nada no banco.

Opcionalmente, execute em `backend`:

```powershell
npm.cmd run seed:catalog
```

O script acrescenta 12 jogos sem apagar ou alterar jogos existentes. **Não cadastra preços fictícios.** Cadastre as ofertas no painel de administração.

Para criar um administrador novo pelo mesmo script, configure `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` em `backend/.env`. Use uma senha de pelo menos 8 caracteres. O script preserva usuários já existentes e não promove nem altera a senha de uma conta existente.

## Telas e escopo da professora

| Requisito do documento anexado | Entrega |
| --- | --- |
| Login e cadastro com JWT | `/entrar`, `/cadastro`, sessão e rotas protegidas |
| Dashboard de ofertas e destaques | `/`, destaque selecionável, jogos e categorias |
| Pesquisa com filtros | `/explorar`, nome, gênero, plataforma, loja, preço, desconto, ordenação e paginação |
| Detalhes e comparação de preços | `/jogo/:id`, ofertas por loja e links externos |
| Cadastro e gerenciamento de mídia física | `/revenda`, `/revenda/novo`, `/revenda/:id/editar`, `/meus-anuncios` |
| Histórico de preços | `/historico`, gráfico interativo, registros e CSV |
| Cadastro e edição de perfil | `/perfil`, nome, e-mail, foto e senha |
| Relatórios de atividades e vendas | `/relatorios`, métricas, plataformas, anúncios e CSV |
| Avaliação | Avaliações de jogos na página de detalhes |
| Administração do catálogo | `/admin`, cadastro/edição de jogos, ofertas e usuários |

Também inclui favoritos locais por conta, central de ajuda, sobre a equipe, preferências, acessibilidade básica por teclado e layout responsivo.

`frontend/src/models/entities.js` contém as classes `User`, `Game`, `PriceOffer`, `Listing`, `Review` e `Report`. Elas normalizam as diferenças entre `id` do GraphQL e `_id` do REST. As seis entidades MongoDB do projeto original foram mantidas.

Os relatórios de vendas usam **vendas declaradas**: o vendedor edita o anúncio e marca o status como vendido. O total usa o preço do anúncio. Não há processamento de pagamento ou confirmação financeira. O relatório é calculado a partir dos anúncios; não cria uma coleção de transações.

## Organização

```text
UniGames/
  frontend/
    public/games/        Capas e imagens de exemplo locais
    src/components/     Componentes reutilizáveis
    src/context/        Sessão, favoritos e notificações
    src/data/           Dados ilustrativos
    src/graphql/        Queries, fragments e mutations
    src/hooks/          Carregamento e tratamento de erros
    src/models/         Seis classes do domínio
    src/pages/          Telas completas
    src/services/       Adaptadores demo, GraphQL e REST
    test/               Testes da simulação local
  backend/
    src/services/       Regras comuns REST/GraphQL
    scripts/            Seed opcional do catálogo
    test/               Validação dos contratos GraphQL
  docs/                 Integração, verificação e prévias
```

A pasta correta é `UniGames/frontend`. A segunda pasta `frontend/frontend` do ZIP original era outro boilerplate Vite e não faz parte desta entrega. `node_modules` e `.git` não são distribuídos; `npm ci` instala as dependências do lockfile.

## Verificação

No front-end: `npm.cmd test`, `npm.cmd run lint` e `npm.cmd run build`.

No backend: `npm.cmd test` valida todas as 23 operações GraphQL do front contra o schema. Os testes incluídos não conectam ao Atlas.

A integração também foi verificada durante o desenvolvimento com MongoDB temporário e navegação real, em GraphQL e REST. Consulte `docs/VERIFICACAO.md` para o escopo desses testes.

## Limites atuais

- Os preços vêm dos dados cadastrados no backend; não existe coleta automática de Steam, Nuuvem ou Epic Games.
- Favoritos e preferências são locais; não sincronizam entre dispositivos.
- Recuperação de senha por e-mail não está implementada.
- A revenda combina pagamento e entrega entre jogadores, conforme o escopo acadêmico.
- Anúncios antigos sem `vendedor` não aparecem em “Meus anúncios”. Não se atribui automaticamente um anúncio antigo a alguém por nome ou e-mail; o administrador pode revisá-lo ou o vendedor pode recriá-lo.

## Equipe e créditos

Elian Barros · Igor Morais · José Artur · Rafael Barbosa · Renner Farias.

CESED / UNIFACISA · Sistemas de Informação · 2026.2 · Professora Sheila Maria.

As capas são imagens oficiais distribuídas nas páginas do Steam dos respectivos jogos, usadas como referências para esta demonstração acadêmica. Consulte `frontend/public/games/credits.json`. As marcas e imagens pertencem aos titulares. A fonte Inter é distribuída sob SIL Open Font License; a licença acompanha o arquivo em `frontend/public/fonts/OFL.txt`.
