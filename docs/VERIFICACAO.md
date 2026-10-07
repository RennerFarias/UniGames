# Verificação da revisão

Revisão em 06/10/2026, horário de Brasília, com Node.js 24.19 e MongoDB 7.0.24
local e temporário. O Atlas configurado no arquivo original não foi acessado.

| Verificação                                     | Resultado                                                              |
| ----------------------------------------------- | ---------------------------------------------------------------------- |
| Contratos do frontend contra o schema GraphQL   | 33 operações aprovadas                                                 |
| Validação de nascimento e cálculo da idade      | 2 testes aprovados                                                     |
| Demonstração local                              | 6 testes aprovados                                                     |
| Integração HTTP GraphQL e REST com MongoDB      | 11 cenários aprovados                                                  |
| Interface em Chromium 140                       | GraphQL, REST e demo aprovados nos fluxos descritos abaixo             |
| Layout no celular                               | Home conferida em 390 por 844 pixels, sem rolagem horizontal da página |
| Compilação de produção do frontend              | Aprovada                                                               |
| Análise estática do frontend e código backend   | Sem erros ou avisos de código                                          |
| Auditoria de dependências do backend e frontend | Nenhum alerta após as atualizações dos arquivos de dependências        |
| Formatação com Prettier                         | Todos os arquivos conferidos                                           |
| Word do escopo                                  | Cinco páginas renderizadas e conferidas; conteúdo original preservado  |

O teste de integração tem um teste principal e onze subtestes. Por isso o Node
mostra 12 testes aprovados. Ele cobre cadastro, hash, login, sessão, permissões,
pesquisa com caracteres especiais, validação de nascimento, ativação de revenda,
propriedade de anúncio, pausa, venda declarada, relatório pessoal, ofertas,
histórico de preço, avaliações, relatórios salvos, rotas do escopo e exclusões
com registros vinculados.

## Conferência da interface

Nos três modos, os testes percorreram cadastro, ativação da conta de revendedor,
criação de anúncio, edição para Vendido, visualização do relatório, exclusão com
confirmação e nova consulta após recarregar. Também conferiram filtro por título
e a Home em tamanho de celular. Esses fluxos terminaram sem erros de execução
ou avisos no console do navegador.

GraphQL e REST usaram um MongoDB isolado, com catálogo e oferta de teste. O modo
demo usou seus dados locais. Os exemplos do teste não foram gravados no banco
do grupo.

A captura `docs/previews/relatorio-graphql.png` mostra a venda declarada durante
o teste. `docs/previews/home-mobile-graphql.png` mostra a Home com dados da API.
As outras capturas são prévias de demonstração que já acompanhavam o projeto.

## Repetir os testes

No PowerShell, partindo da pasta principal:

```powershell
npm.cmd ci
npm.cmd ci --prefix backend
npm.cmd ci --prefix frontend
npm.cmd run format:check
npm.cmd test --prefix backend
npm.cmd test --prefix frontend
npm.cmd run lint --prefix frontend
npm.cmd run build --prefix frontend
```

Sem `TEST_MONGODB_URI`, a integração é ignorada no comando de testes do backend.
Os contratos GraphQL e os testes de nascimento continuam sendo executados.
A integração foi executada separadamente durante esta revisão.

Para repeti-la, use um MongoDB local com um banco exclusivo de teste:

```powershell
cd backend
$env:TEST_MONGODB_URI = 'mongodb://127.0.0.1:27017/unigames_test_revisao'
npm.cmd run test:integration
Remove-Item Env:TEST_MONGODB_URI
```

Esse comando grava dados de teste e apaga somente o banco especificado ao final.
O script recusa servidores remotos e nomes sem o prefixo `unigames_test_`.
Os testes do navegador foram executados durante a revisão; não fazem parte
do comando npm test nem exigem uma dependência de navegador na entrega.

A configuração real do grupo ainda depende da URI, das credenciais, das
permissões de rede no Atlas e da disponibilidade do MongoDB. Os testes não
validam o acesso ao cluster do grupo. As pendências funcionais estão em
`REVISAO_ESCOPO.md`.
