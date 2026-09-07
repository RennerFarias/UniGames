const dns = require('dns');
dns.setServers(['8.8.8.8']);

require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const {
    expressMiddleware
} = require('@as-integrations/express5');
const {
    ApolloServer
} = require('@apollo/server');

const conectarBanco = require('./database');

const authRoutes = require('./routes/authRoutes');
const jogoRoutes = require('./routes/jogoRoutes');
const revendaRoutes = require('./routes/revendaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const {
    typeDefs,
    resolvers
} = require('./graphql/schema');

const app = express();

app.use(express.json());
app.use(usuarioRoutes);

conectarBanco();

app.use(authRoutes);
app.use(jogoRoutes);
app.use(revendaRoutes);

const obterUsuarioDoToken = (req) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return null;
    }

    const [tipo, token] = authorization.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return null;
    }

    try {
        return jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    } catch (error) {
        return null;
    }
};

const iniciarServidor = async () => {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    });

    await apolloServer.start();

    app.use(
        '/graphql',
        expressMiddleware(apolloServer, {
            context: async ({ req }) => {
                const usuario = obterUsuarioDoToken(req);
                return {
                    usuario
                };
            }
        })
    );

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`GraphQL disponível em http://localhost:${PORT}/graphql`);
    });
};

iniciarServidor();