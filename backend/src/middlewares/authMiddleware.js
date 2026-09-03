const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensagem: 'Token de autenticação não fornecido'
        });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            mensagem: 'Formato do token inválido. Use: Bearer <token>'
        });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'unigames_chave_secreta_2026');
        req.User = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({
            mensagem: 'Token inválido ou expirado'
        });
    }
};

module.exports = autenticar;
