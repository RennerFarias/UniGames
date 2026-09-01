# Status do Backend - UniGames 

### O que já está pronto e funcionando:
* **Banco conectado:** Já configurei a conexão com o MongoDB Atlas pelo `.env`. Tá rodando liso.
* **Autenticação JWT:** Cadastro de usuários (`/auth/cadastro`), login (`/auth/login`) com token JWT gerado e middleware de proteção (`authMiddleware.js`) aplicados nas rotas privadas.
* **Rotas de Jogos:** Model e rotas (`/jogos`) para cadastrar (protegido por JWT), listar, atualizar e deletar.
* **Anúncios de Revenda:** Rotas (`/anuncios`) para cadastrar, listar e remover anúncios de mídia física.
* **Estrutura das pastas:** Estrutura pronta com controllers, middlewares, models, routes e graphql.


* **Início de utilização do Graphql:**

Teste Rápido no Postman:
1. **Cadastro:** `POST http://localhost:3000/auth/cadastro` -> `{ "nome": "User", "email": "a@a.com", "senha": "123" }`

2. **Login:** `POST http://localhost:3000/auth/login` -> `{ "email": "a@a.com", "senha": "123" }`

3. **Rota Protegida:** `POST http://localhost:3000/jogos` -> Na aba **Auth** escolha **Bearer Token** e cole o token -> `{ "titulo": "God of War" }`

<sub>Projeto acadêmico — Sistemas de Informação, CESED/UNIFACISA · Competência: Integrar Interfaces e Serviço Web · Prof. Sheila Maria · 2026.2</sub>



