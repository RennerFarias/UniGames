const Game = require('../models/Game');

// Criar novo jogo
const cadastrarJogo = async (req, res) => {
    try {
        const { titulo, descricao, generos, plataformas, imagemCapa, linksReferencia } = req.body;

        if (!titulo) {
            return res.status(400).json({ error: "O campo 'titulo' é obrigatório." });
        }

        const novoJogo = new Game({
            titulo,
            descricao,
            generos,
            plataformas,
            imagemCapa,
            linksReferencia
        });

        await novoJogo.save();

        res.status(201).json({
            status: "Sucesso",
            message: "Jogo cadastrado com sucesso!",
            jogo: novoJogo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar jogos
const listarJogos = async (req, res) => {
    try {
        const { titulo, genero, plataforma, limite = 10, pagina = 1 } = req.query;

        const query = {};

        if (titulo) {
            query.titulo = { $regex: titulo, $options: 'i' }; 
        }

        if (genero) {
            query.generos = genero; 
        }

        if (plataforma) {
            query.plataformas = plataforma; 
        }

        const skip = (parseInt(pagina) - 1) * parseInt(limite);

        const jogos = await Game.find(query)
            .skip(skip)
            .limit(parseInt(limite));

        const total = await Game.countDocuments(query);

        res.status(200).json({
            status: "Sucesso",
            jogos,
            paginacao: {
                total,
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                paginas: Math.ceil(total / limite)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar jogo por ID
const obterJogoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const jogo = await Game.findById(id);

        if (!jogo) {
            return res.status(404).json({ error: "Jogo não encontrado." });
        }

        res.status(200).json({
            status: "Sucesso",
            jogo
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: "ID de jogo inválido." });
        }
        res.status(500).json({ error: error.message });
    }
};

// Editar jogo
const atualizarJogo = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, generos, plataformas, imagemCapa, linksReferencia } = req.body;

        const jogoAtualizado = await Game.findByIdAndUpdate(
            id,
            { titulo, descricao, generos, plataformas, imagemCapa, linksReferencia },
            { new: true, runValidators: true }
        );

        if (!jogoAtualizado) {
            return res.status(404).json({ error: "Jogo não encontrado." });
        }

        res.status(200).json({
            status: "Sucesso",
            message: "Jogo atualizado com sucesso!",
            jogo: jogoAtualizado
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: "ID de jogo inválido." });
        }
        res.status(500).json({ error: error.message });
    }
};

// Deletar jogo
const deletarJogo = async (req, res) => {
    try {
        const { id } = req.params;
        const jogoDeletado = await Game.findByIdAndDelete(id);

        if (!jogoDeletado) {
            return res.status(404).json({ error: "Jogo não encontrado." });
        }

        res.status(200).json({
            status: "Sucesso",
            message: "Jogo removido com sucesso!"
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: "ID de jogo inválido." });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    cadastrarJogo,
    listarJogos,
    obterJogoPorId,
    atualizarJogo,
    deletarJogo
};
