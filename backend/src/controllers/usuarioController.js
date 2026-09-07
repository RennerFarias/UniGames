const bcrypt = require('bcryptjs');
const User = require('../models/User');

const obterPerfil = async (req, res) => {
    try {
        const usuario = await User.findById(req.usuario.id).select('-senha');

        if (!usuario) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });
        }

        res.status(200).json({
            status: 'Sucesso',
            usuario
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao obter perfil',
            erro: error.message
        });
    }
};

const atualizarPerfil = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const dadosAtualizados = {};

        if (nome) dadosAtualizados.nome = nome;
        if (email) dadosAtualizados.email = email;

        if (senha) {
            dadosAtualizados.senha = await bcrypt.hash(senha, 10);
        }

        const usuarioAtualizado = await User.findByIdAndUpdate(
            req.usuario.id,
            dadosAtualizados,
            { new: true, runValidators: true }
        ).select('-senha');

        if (!usuarioAtualizado) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });
        }

        res.status(200).json({
            status: 'Sucesso',
            mensagem: 'Perfil atualizado com sucesso',
            usuario: usuarioAtualizado
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                mensagem: 'Email já cadastrado por outro usuário'
            });
        }
        res.status(500).json({
            mensagem: 'Erro ao atualizar perfil',
            erro: error.message
        });
    }
};

const removerUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuarioRemovido = await User.findByIdAndDelete(id);

        if (!usuarioRemovido) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });
        }

        res.status(200).json({
            status: 'Sucesso',
            mensagem: 'Usuário removido com sucesso'
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ mensagem: 'ID de usuário inválido.' });
        }
        res.status(500).json({
            mensagem: 'Erro ao remover usuário',
            erro: error.message
        });
    }
};

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find().select('-senha');

        res.status(200).json({
            status: 'Sucesso',
            total: usuarios.length,
            usuarios
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao listar usuários',
            erro: error.message
        });
    }
};

module.exports = {
    obterPerfil,
    atualizarPerfil,
    removerUsuario,
    listarUsuarios
};