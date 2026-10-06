# UniGames

Aplicação para consultar jogos, comparar ofertas e anunciar mídia física para revenda.
O front usa React. O backend usa Express, Apollo Server, Mongoose e MongoDB.

## Executar o projeto

Use Node.js 22.12 ou superior. A revisão foi testada com Node.js 24.

### Backend

No PowerShell, dentro da pasta do projeto:

```powershell
cd backend
npm.cmd ci
Copy-Item .env.example .env
```

Se você já tem um arquivo `.env`, mantenha seus valores. Configure nele:

- `MONGODB_URI`: endereço do MongoDB local ou a URI do seu MongoDB Atlas.
- `JWT_SECRET`: uma chave própria para assinar os tokens.
- `PORT`: porta do backend; o exemplo usa 3000.

O exemplo usa `mongodb://127.0.0.1:27017/unigames`, que exige MongoDB instalado
e em execução. Para usar o Atlas, coloque a URI do seu cluster, com o banco
`unigames`, no lugar desse endereço. A URI e a senha do banco ficam somente
no backend.

Inicie:

```powershell
npm.cmd start
```

O terminal deve mostrar a conexão com o MongoDB e o endereço
`http://localhost:3000/graphql`. O servidor aguarda o banco antes de abrir a porta.
`GET /health` informa se a conexão está disponível.

### Frontend

Em outro terminal, partindo da pasta principal:

```powershell
cd frontend
npm.cmd ci
Copy-Item .env.example .env
npm.cmd run dev
```

Abra `http://localhost:5173`. O arquivo de exemplo usa `VITE_DATA_SOURCE=graphql`.

| Valor | Origem dos dados |
| --- | --- |
| `graphql` | Backend Apollo e MongoDB |
| `rest` | Rotas Express e MongoDB |
| `demo` | Dados locais do navegador, sem MongoDB |

Reinicie o Vite depois de alterar o `.env`. No Windows,
`Iniciar_UniGames.bat` ajuda a abrir o projeto depois da configuração.

### Catálogo e administrador

O banco real pode começar vazio. Para acrescentar os jogos de exemplo, execute
`npm.cmd run seed:catalog` no backend. O seed mantém jogos existentes e não cria
preços fictícios.

Para criar um administrador novo, preencha `SEED_ADMIN_EMAIL` e
`SEED_ADMIN_PASSWORD` no backend antes do seed. A senha precisa ter pelo menos
8 caracteres. Uma conta existente não tem seu perfil ou senha alterados pelo seed.
As ofertas podem ser cadastradas pelo painel de administração.

No modo demo, as contas `demo@unigames.com` e `admin@unigames.com` usam
`unigames123`. Elas pertencem à simulação local e não são criadas no Atlas.

## Onde está cada parte

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| `backend/src/database.js` | Abre a conexão do Mongoose com o MongoDB |
| `backend/src/server.js` | Carrega o ambiente, inicia Express e disponibiliza GraphQL |
| `backend/src/models/` | Define os documentos e suas referências |
| `backend/src/graphql/typeDefs.js` | Declara tipos, entradas, consultas e mutations |
| `backend/src/graphql/resolvers/` | Organiza as operações por entidade |
| `backend/src/services/userService.js` | Cadastro, login, perfil e leitura do JWT |
| `backend/src/services/domainService.js` | Revenda, preços, avaliações e permissões |
| `backend/src/services/reportService.js` | Gera e consulta relatórios salvos |
| `frontend/src/services/api.js` | Escolhe demo, GraphQL ou REST |
| `frontend/src/services/apollo.js` | Configura o cliente HTTP e o envio do token |
| `frontend/src/services/graphql.js` | Executa as operações e monta as entidades do front |
| `frontend/src/graphql/` | Guarda as queries, mutations e fragments |
| `frontend/src/models/entities.js` | Classes usadas para organizar os dados das telas |

A explicação completa está em `docs/GUIA_APRESENTACAO.md`. Há exemplos de operações
em `docs/EXEMPLOS_GRAPHQL.graphql` e a lista de recursos em `docs/INTEGRACAO.md`.

## Verificar

```powershell
npm.cmd test --prefix backend
npm.cmd test --prefix frontend
npm.cmd run lint --prefix frontend
npm.cmd run build --prefix frontend
```

A integração com um banco local de teste usa `TEST_MONGODB_URI`. Ela aceita
somente localhost ou 127.0.0.1 e um banco com prefixo `unigames_test_`.
Esse teste apaga o banco de teste ao terminar. As instruções estão em
`docs/VERIFICACAO.md`.

## Limites dos recursos

As ofertas são cadastradas no sistema; a coleta automática de lojas externas
ainda não foi implementada. As vendas são marcadas pelo anunciante e não
comprovam pagamento. O projeto não tem checkout nem integração de frete.
Relatórios de buscas frequentes dependem de um registro de pesquisas que ainda
não existe.

Os arquivos `.env`, dependências instaladas e histórico Git não fazem parte do
pacote de entrega. As configurações de exemplo acompanham o código.
