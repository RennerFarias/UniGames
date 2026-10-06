# Verificação da revisão

Revisão em 05/10/2026 (horário de Brasília), com Node.js 24.19.
O backend foi testado com MongoDB 7.0.24 temporário e isolado. O Atlas
configurado no arquivo original não foi acessado.

| Verificação | Resultado |
| --- | --- |
| Contratos do frontend contra o schema GraphQL | 33 operações aprovadas |
| Demonstração local | 6 testes aprovados |
| Integração HTTP GraphQL/REST com MongoDB | 10 cenários aprovados |
| Interface GraphQL em Chromium 153 | Cadastro, ativação, anúncio, edição, venda e relatório aprovados |
| Compilação de produção do frontend | Aprovada |
| Análise estática do frontend e código backend | Sem erros ou avisos de código |

A integração tem um teste principal e dez subtestes, por isso o Node mostra
11 testes aprovados. Ela cobre cadastro, senha com hash, login, sessão,
permissões administrativas, pesquisa, idade de revendedor, proprietário de
anúncio, status, venda declarada, relatório pessoal, desconto, histórico,
avaliações, relatórios salvos, REST e bloqueio de exclusões com vínculos.

## Repetir os testes

No PowerShell, partindo da pasta principal:

```powershell
npm.cmd test --prefix backend
npm.cmd test --prefix frontend
npm.cmd run lint --prefix frontend
npm.cmd run build --prefix frontend
```

Sem `TEST_MONGODB_URI`, o teste de integração é ignorado. Os contratos GraphQL
continuam sendo executados normalmente.

Para testar a integração, use um MongoDB local com um banco exclusivo de teste:

```powershell
cd backend
$env:TEST_MONGODB_URI = 'mongodb://127.0.0.1:27017/unigames_test_revisao'
npm.cmd run test:integration
Remove-Item Env:TEST_MONGODB_URI
```

Esse comando grava dados de teste e apaga somente o banco especificado ao
final. O script recusa servidores remotos e nomes sem o prefixo
`unigames_test_`.

A conferência da interface usou o backend e um MongoDB temporário. Não houve erros de execução do React nos fluxos exercitados. A captura `docs/previews/relatorio-graphql.png` mostra esse teste. As demais capturas são as prévias de demonstração que já acompanhavam o projeto.

A configuração real do grupo ainda depende da URI, das credenciais, das
permissões de rede no Atlas e da disponibilidade do MongoDB. Os testes
não validam o acesso ao cluster do grupo.
