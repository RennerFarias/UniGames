# Status do Backend - UniGames 

Fala galera, deixei esse resumo aqui pra vocês saberem o que eu já fiz no backend até agora e o que a gente precisa ir fazendo daqui pra frente.

### O que já está pronto e funcionando:
* **Banco conectado:** Já configurei a conexão com o MongoDB Atlas pelo `.env`. Tá rodando liso.
* **Rotas de Jogos:** Criei o model de jogos e todas as rotas (`/jogos`) para cadastrar, listar (com busca e paginação), atualizar e deletar. Tudo testado e funcionando.
* **Estrutura das pastas:** Já criei os arquivos de rotas, controllers e models (vazios) para anúncios, usuários e relatórios. A estrutura já está pronta para o resto do projeto.

###  O que a gente precisa fazer (pra dividir o trabalho):
* **Anúncios de Revenda:** Fazer as rotas para criar e listar os anúncios de mídia física da galera (públicos, sem exigir login por enquanto).
* **Histórico de preços:** Modelar e programar como vamos salvar e exibir a variação de preço de cada jogo.
* **Login/JWT:** Esperar as aulas de JWT e criptografia para fazermos o login e perfil do usuário do jeito certo.
* **Relatórios:** Fazer as rotas para gerar os dados do dashboard (jogos em destaque, etc.).


