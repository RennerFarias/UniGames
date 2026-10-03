# Backend UniGames · Estado desta entrega

Mantidos Express 5, Apollo Server 5, MongoDB/Mongoose e JWT. O schema GraphQL foi ampliado para os fluxos do front-end. As APIs REST oferecem os mesmos fluxos.

O backend inclui propriedade e status de anúncios, relatório pessoal de vendas declaradas, ofertas, atualização de preço com histórico, avaliações e foto de perfil. As regras de revenda, preços e exclusões ficam em `src/services/domainService.js`.

Configure `backend/.env` com seu próprio `MONGODB_URI` e `JWT_SECRET`. O arquivo `.env` original não é distribuído. `npm ci` instala as dependências e `npm start` inicia a porta 3000 por padrão.

`npm test` valida as 23 operações GraphQL do front-end, sem acessar banco. `npm run seed:catalog` é opcional, acrescenta jogos sem apagar o catálogo e pode criar um administrador novo se as variáveis de seed forem definidas. Nenhum seed foi executado no MongoDB Atlas do usuário.

O relatório consolida anúncios; não representa confirmação de pagamento. Não há coleta automática de preços externos.
