# Verificação da entrega

Verificado em 02/10/2026, com Node.js 24 e Chromium. A integração usou MongoDB 7 temporário e isolado. O MongoDB Atlas do arquivo original não foi acessado nem alterado durante esses testes.

| Verificação | Resultado |
| --- | --- |
| Compilação de produção (`npm run build`) | Aprovada; JavaScript dividido em aplicação, vendor e GraphQL |
| Verificação estática (`npm run lint`) | Aprovada sem erros ou avisos de código |
| Testes incluídos do modo demo | 4 aprovados |
| Contratos GraphQL incluídos | 23 operações validadas contra o schema |
| Integração de servidor GraphQL/REST com MongoDB temporário | 32 verificações aprovadas |
| Fluxos de interface em GraphQL e REST com backend real de teste | 20 verificações aprovadas |
| Fluxos de interface em demonstração e larguras móveis | 23 verificações aprovadas |
| Inspeção visual | Home, catálogo, detalhes, revenda e telas auxiliares conferidos |

Os testes de servidor cobriram cadastro/login, JWT, permissões de admin, criação de jogos/ofertas, desconto, histórico de preço, propriedade dos anúncios, venda declarada, relatório, avaliação, perfil e rejeição de token de usuário removido.

Os testes do navegador exercitaram catálogo, histórico com datas retornadas pelo GraphQL, login, criação/edição de anúncios, venda declarada, relatórios, avaliações e atualização de perfil, usando ambos os adaptadores. No modo demo, também foram exercitados favoritos persistentes, cadastro, administração de catálogo/ofertas, exclusão confirmada e páginas móveis.

A revisão de interface corrigiu a preservação da aba de ofertas após salvar preços no painel e incluiu saída da conta em telas móveis. Não foram observados erros de execução React nos fluxos testados.

Os scripts transitórios de navegação e MongoDB temporário foram usados na verificação desta entrega. Os testes que acompanham o projeto são os quatro testes demo e os 23 contratos, executáveis sem acessar um banco externo.

## Dependências de ambiente

A conexão no computador do grupo depende do `.env`, da disponibilidade do MongoDB e da rede. Os testes isolados comprovam os contratos e fluxos de integração; não validam as credenciais ou a conectividade do Atlas de vocês.

## Prévia visual

As capturas em `docs/previews` são do modo de demonstração com preços ilustrativos. Elas acompanham o código e não substituem o site em execução.
