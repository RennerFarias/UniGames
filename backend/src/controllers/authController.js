const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const cadastrarUsuario = async (req, res) => {
    try {
        const { senha, dataNascimento } = req.body;
        const nome = String(req.body.nome || '').trim();
        const email = String(req.body.email || '').trim().toLowerCase();

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: 'Nome, email e senha são obrigatórios'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof senha !== 'string' || senha.length < 6) return res.status(400).json({ mensagem: 'Informe e-mail válido e senha com pelo menos 6 caracteres.' });

        const usuarioExistente = await User.findOne({ email });

        if (usuarioExistente) {
            return res.status(409).json({
                mensagem: 'Email já cadastrado'
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const dadosNovoUsuario = {
            nome,
            email,
            senha: senhaCriptografada
        };
        if (dataNascimento) {
            dadosNovoUsuario.dataNascimento = dataNascimento;
        }

        const usuario = new User(dadosNovoUsuario);

        const usuarioSalvo = await usuario.save();

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso',
            usuario: {
                id: usuarioSalvo._id,
                nome: usuarioSalvo.nome,
                email: usuarioSalvo.email,
                perfil: usuarioSalvo.perfil,
                foto: usuarioSalvo.foto || '',
                revendedor: usuarioSalvo.revendedor,
                dataNascimento: usuarioSalvo.dataNascimento
            }
        });

    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário',
            erro: error.message
        });

    }
};

const login = async (req, res) => {
    try {
        const { senha } = req.body;
        const email = String(req.body.email || '').trim().toLowerCase();
        if (!email || typeof senha !== 'string') return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });

        const usuario = await User.findOne({ email });

        if (!usuario) {
            return res.status(401).json({
                mensagem: 'Email ou senha inválidos'
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: 'Email ou senha inválidos'
            });
        }

        const token = jwt.sign(
            {
                id: usuario._id,
                email: usuario.email,
                perfil: usuario.perfil,
                foto: usuario.foto || ''
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            mensagem: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
                foto: usuario.foto || '',
                revendedor: usuario.revendedor,
                dataNascimento: usuario.dataNascimento
            }
        });

    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao realizar login',
            erro: error.message
        });
    }
};

module.exports = {
    cadastrarUsuario,
    login
}; 