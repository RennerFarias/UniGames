const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const http = require('node:http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { expressMiddleware } = require('@as-integrations/express5');
const conectarBanco = require('./database');
const { userFromToken } = require('./services/userService');
const { typeDefs, resolvers } = require('./graphql/schema');

async function criarAplicacao() {
  const app = express();
  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError(formattedError, error) {
      const original = error.originalError;
      if (original?.code === 11000) {
        return {
          message: 'Este registro já está cadastrado.',
          extensions: { code: 'BAD_USER_INPUT' },
        };
      }
      if (['ValidationError', 'CastError'].includes(original?.name)) {
        return { message: 'Confira os dados informados.', extensions: { code: 'BAD_USER_INPUT' } };
      }
      return formattedError;
    },
  });

  await apolloServer.start();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'indisponivel' });
  });

  app.use(require('./routes/integrationRoutes'));
  app.use(require('./routes/usuarioRoutes'));
  app.use(require('./routes/authRoutes'));
  app.use(require('./routes/jogoRoutes'));
  app.use(require('./routes/revendaRoutes'));
  app.use(require('./routes/relatorioRoutes'));

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ usuario: await userFromToken(req.headers.authorization) }),
    }),
  );

  return { app, httpServer, apolloServer };
}

async function iniciarServidor() {
  if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET === 'troque-por-uma-chave-longa-aleatoria'
  ) {
    throw new Error('Defina uma JWT_SECRET própria no arquivo backend/.env.');
  }

  await conectarBanco();
  const server = await criarAplicacao();
  const port = process.env.PORT || 3000;

  await new Promise((resolve, reject) => {
    server.httpServer.once('error', reject);
    server.httpServer.listen(port, resolve);
  });

  console.log('Servidor rodando na porta ' + port);
  console.log('GraphQL disponível em http://localhost:' + port + '/graphql');
  return server;
}

if (require.main === module) {
  iniciarServidor()
    .then((server) => {
      const encerrar = async () => {
        await server.apolloServer.stop();
        await mongoose.disconnect();
      };
      process.once('SIGINT', encerrar);
      process.once('SIGTERM', encerrar);
    })
    .catch(async (error) => {
      const message = error.message.replace(/mongodb(?:\+srv)?:\/\/[^\s]+/g, '[conexão MongoDB]');
      console.error('Não foi possível iniciar o servidor: ' + message);
      await mongoose.disconnect();
      process.exitCode = 1;
    });
}

module.exports = { criarAplicacao, iniciarServidor };
