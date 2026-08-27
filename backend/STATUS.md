# Status do Backend - UniGames 

Fala galera, deixei esse resumo aqui pra vocês saberem o que eu já fiz no backend até agora e o que a gente precisa ir fazendo daqui pra frente.

### O que já está pronto e funcionando:
* **Banco conectado:** Já configurei a conexão com o MongoDB Atlas pelo `.env`. Tá rodando liso.
* **Rotas de Jogos:** Criei o model de jogos e todas as rotas (`/jogos`) para cadastrar, listar (com busca e paginação), atualizar e deletar. Tudo testado e funcionando.
* **Anúncios de Revenda:** Rotas (`/anuncios`) públicas prontas e integradas com o banco para cadastrar, listar (trazendo os dados do jogo associado) e remover anúncios de mídia física de forma simples.
* **Estrutura das pastas:** Já criei os arquivos de rotas, controllers e models para anúncios, usuários e relatórios. A estrutura já está pronta para o resto do projeto.

###  O que a gente precisa fazer (pra dividir o trabalho):
* **Histórico de preços:** Modelar e programar como vamos salvar e exibir a variação de preço de cada jogo.
* **Login/JWT:** Esperar as aulas de JWT e criptografia para fazermos o login e perfil do usuário do jeito certo.
* **Relatórios:** Fazer as rotas para gerar os dados do dashboard (jogos em destaque, etc.).

## Como voces podem fazer para testar a API

Certifique-se de que o backend está rodando localmente em `http://localhost:3000`.

### 1. Adicionar Jogo (Cadastrar)
* **Método:** `POST`
* **URL:** `http://localhost:3000/jogos`
* **Headers:** `Content-Type: application/json`
* **Corpo (JSON - raw):**
```json
{
  "titulo": "Minecraft",
  "descricao": "Explore mundos gerados aleatoriamente e construa coisas incríveis.",
  "generos": ["Sandbox", "Sobrevivência"],
  "plataformas": ["PC", "Xbox One", "PS4", "Nintendo Switch"],
  "imagemCapa": "https://example.com/minecraft.png",
  "linksReferencia": ["https://www.minecraft.net"]
}
```

### 2. Listar Jogos (isso aqui eu pedi pra ia fazer porque eu não fazia ideia de como fazer para listar, perdão amigoskkk)
* **Método:** `GET`
* **URL Básica (Lista todos os jogos):** `http://localhost:3000/jogos`

* **Como usar os Filtros (Query Params) no Postman:**
  No Postman, você pode filtrar os resultados de duas formas:
  
  **Opção A: Escrevendo direto na URL**
  Cole o endereço com o filtro desejado na barra de URL do Postman e clique em **Send**:
  * Filtrar por título: `http://localhost:3000/jogos?titulo=Minecraft`
  * Filtrar por gênero: `http://localhost:3000/jogos?genero=Sandbox`
  * Filtrar por plataforma: `http://localhost:3000/jogos?plataforma=PC`
  * Combinar filtros: `http://localhost:3000/jogos?titulo=Minecraft&plataforma=PC`
  * Limitar quantidade de resultados (ex: 5 jogos): `http://localhost:3000/jogos?limite=5`
  
  **Opção B: Usando a aba "Params" (Recomendado)**
  1. Defina o método como `GET` e insira a URL: `http://localhost:3000/jogos`.
  2. Clique na aba **Params** (localizada logo abaixo do campo da URL).
  3. Preencha a tabela de parâmetros (**Query Params**):
     * Na coluna **Key** (Chave), digite o filtro desejado (ex: `titulo` ou `genero`).
     * Na coluna **Value** (Valor), digite o termo de busca (ex: `Minecraft` ou `Sandbox`).
  4. Clique em **Send**.

### 3. Remover Jogo
* **Método:** `DELETE`
* **URL:** `http://localhost:3000/jogos/:id` *(Substitua `:id` pelo ID real do jogo obtido na listagem)*

## Como testar os Anúncios de Revenda (Mídia Física)

### 1. Adicionar Anúncio (Cadastrar)
* **Método:** `POST`
* **URL:** `http://localhost:3000/anuncios`
* **Headers:** `Content-Type: application/json`
* **Corpo (JSON - raw):**
```json
{
  "jogo": "COLOQUE_O_ID_DE_UM_JOGO_AQUI",
  "preco": 150.00,
  "estadoConservacao": "Excelente",
  "plataforma": "PS5",
  "contato": {
    "nome": "Renner Farias",
    "info": "83999999999"
  },
  "descricao": "Mídia física impecável, sem arranhões. Aceito trocas."
}
```

### 2. Listar Anúncios
* **Método:** `GET`
* **URL Básica (Lista todos os anúncios com dados do jogo inclusos):** `http://localhost:3000/anuncios`
* **Filtros Opcionais (Query Params):** `plataforma`, `estadoConservacao`, `limite`, `pagina`

### 3. Remover Anúncio
* **Método:** `DELETE`
* **URL:** `http://localhost:3000/anuncios/:id` *(Substitua `:id` pelo ID real do anúncio obtido na listagem de anúncios)*

---

<sub>Projeto acadêmico — Sistemas de Informação, CESED/UNIFACISA · Competência: Integrar Interfaces e Serviço Web · Prof. Sheila Maria · 2026.2</sub>



