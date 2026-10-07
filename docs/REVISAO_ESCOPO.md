# Revisão do escopo do UniGames

Revisão em 06/10/2026, horário de Brasília.

As funcionalidades principais do escopo estão implementadas. A revisão corrigiu
falhas na ativação de revendedor e na exclusão de anúncios, organizou o código
e alinhou as rotas REST ao documento inicial. O relatório de buscas frequentes
ainda está pendente. As ofertas são cadastradas pelo administrador; a aplicação
compara os valores registrados e ainda não coleta preços de lojas externas.

## Comparação com o documento inicial

| Requisito                                  | Situação                        | Implementação                                                                                                                                                     |
| ------------------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cadastro e edição de perfil                | Atendido                        | Cadastro, nome, e-mail, foto e alteração de senha pela interface e pelas APIs.                                                                                    |
| Login e autenticação JWT                   | Atendido                        | Senhas protegidas com bcrypt; token validado pelo backend e enviado nas requisições.                                                                              |
| Autorização                                | Atendido                        | Administração restrita ao perfil admin; anúncios e avaliações só podem ser alterados pelo autor ou admin.                                                         |
| Consulta de jogos, preços e plataformas    | Atendido com dados cadastrados  | Catálogo, comparação por loja e filtros por título, gênero, plataforma, loja e preço.                                                                             |
| Cadastro e gerenciamento de revenda física | Atendido                        | Ativação de revendedor, criação, edição, pausa, venda declarada e exclusão de anúncio.                                                                            |
| Histórico de preços por jogo               | Atendido                        | Ofertas guardam os preços anteriores; atualização do preço acrescenta um registro.                                                                                |
| Dashboard de ofertas e destaques           | Atendido                        | Home usa o catálogo e as ofertas disponíveis; o banco real precisa ter dados cadastrados.                                                                         |
| Relatórios de atividades e vendas          | Atendido para vendas declaradas | Relatório pessoal, distribuição por plataforma e exportação CSV. O vendedor marca a venda; não há confirmação de pagamento.                                       |
| Relatórios administrativos                 | Atendido na API                 | Atividade de usuários, ofertas em destaque e variação de preços podem ser geradas, salvas, consultadas e excluídas. Não há tela específica para esses relatórios. |
| Buscas frequentes                          | Pendente                        | O tipo existe no schema, mas o sistema ainda não registra as pesquisas. A API informa que a geração está indisponível.                                            |
| Avaliações de jogos e revendedores         | Parcial na interface            | A API aceita jogo ou usuário como alvo. A tela de detalhes permite avaliar jogos; falta uma tela para avaliar revendedores.                                       |
| RESTful e GraphQL                          | Atendido                        | Express e Apollo oferecem as operações sobre o mesmo MongoDB; as seis entidades têm contratos GraphQL.                                                            |
| Interface responsiva                       | Atendido nos fluxos testados    | CSS possui adaptações para telas menores; o resultado dos testes está em VERIFICACAO.md.                                                                          |
| Pagamentos e logística                     | Fora do escopo                  | Compra externa ou negociação entre usuários, como definido no documento inicial.                                                                                  |

## Entidades do MongoDB

| Entidade do escopo | Model                              | Responsabilidade                                               |
| ------------------ | ---------------------------------- | -------------------------------------------------------------- |
| Usuário            | `backend/src/models/User.js`       | Conta, hash de senha, perfil e ativação de revenda.            |
| Jogo               | `backend/src/models/Game.js`       | Título, descrição, gêneros, plataformas, capa e referências.   |
| Oferta             | `backend/src/models/PriceOffer.js` | Loja, preço, desconto e histórico.                             |
| Anúncio            | `backend/src/models/Listing.js`    | Vendedor, jogo, mídia, contato, preço, status e data de venda. |
| Avaliação          | `backend/src/models/Review.js`     | Autor, alvo, nota e comentário.                                |
| Relatório          | `backend/src/models/Report.js`     | Tipo, descrição e dados consolidados no momento da geração.    |

A descrição do Word usa “senha criptografada”. O código usa hash com bcrypt,
que é a proteção aplicada ao cadastro e à comparação da senha no login.

## Correções e organização

- A ativação de revendedor tentava salvar a variável `nascimento` sem defini-la.
  A data agora é validada antes do cálculo da idade e da gravação. O cálculo
  também aceita o objeto Date retornado pelo MongoDB.
- A exclusão na tela Meus anúncios chamava `upgradeUser`, que não existia.
  Agora chama `api.deleteListing`, fecha a confirmação e atualiza a lista.
- A cache do Apollo substitui a lista de anúncios após alterações e exclusões.
- Os arquivos de dependências foram atualizados para corrigir os alertas
  encontrados pelo npm audit, mantendo as versões principais declaradas no projeto.
- Foram acrescentados `/auth/register` e `/revendas` com as mesmas regras dos
  caminhos existentes. O frontend continua compatível com os caminhos antigos.
- A consulta REST de jogo agora retorna suas ofertas. A listagem valida a
  paginação e pesquisa colchetes, chaves e outros caracteres como texto.
- Os filtros REST de revenda incluem jogo e preço máximo.
- JavaScript, JSX, CSS, HTML, GraphQL e JSON foram formatados. A tela de
  autenticação, antes concentrada em linhas enormes, foi dividida em blocos
  legíveis. As configurações de Prettier e EditorConfig ajudam a manter o padrão.
- A cópia antiga em `frontend/frontend`, o CSS inicial do Vite não importado e
  o controller de revenda sem uso foram retirados da entrega.
- O Word recebeu títulos com estilos, tabelas de endpoints, linhas de tabela
  sem divisão entre páginas e um diagrama legível. Os requisitos e descrições
  originais foram preservados.

## Pontos para concluir o escopo

O relatório de buscas frequentes exige registrar eventos de pesquisa no backend
e consultar esses registros para gerar as estatísticas. Como a pesquisa das
telas ocorre no catálogo já carregado, somente contar chamadas a `getGames`
não representaria as buscas feitas pelos usuários.

Para preços externos, é necessário escolher as lojas, suas fontes ou APIs e
a frequência de atualização. A importação deve gravar ofertas e seu histórico
no backend. Os preços do modo demo são ilustrativos e não validam essa integração.

A avaliação de revendedores já tem suporte no backend, mas precisa de uma
interface de consulta e publicação. Os relatórios administrativos salvos também
podem ganhar uma tela no painel admin; as operações atuais estão disponíveis
em REST e GraphQL.

## Execução e entrega

Mantenha os arquivos `.env` do grupo ao aplicar os arquivos revisados. O pacote
inclui `.env.example`, mas não inclui credenciais, node_modules ou histórico Git.
As instruções de instalação e início continuam no README. O banco de produção
precisa da configuração de URI, usuário, senha e acesso de rede do grupo.

O enunciado pede o link da solução no GitHub e apresentação. Antes de enviar,
aplique os arquivos revisados ao repositório e confira o README, o Word e os
comandos de execução a partir de uma instalação limpa.
