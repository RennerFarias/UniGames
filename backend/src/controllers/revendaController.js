const Listing = require('../models/Listing');
const Game = require('../models/Game');

// Cria um novo anúncio de revenda
const criarAnuncio = async (req, res) => {
    try {
        const { jogo, preco, estadoConservacao, plataforma, contato, descricao } = req.body;

        // Valida se o jogo existe no banco
        const jogoExiste = await Game.findById(jogo);
        if (!jogoExiste) {
            return res.status(404).json({ error: "O jogo referenciado não foi encontrado." });
        }

        const novoAnuncio = new Listing({
            jogo,
            preco,
            estadoConservacao,
            plataforma,
            contato,
            descricao
        });

        await novoAnuncio.save();

        res.status(201).json({
            status: "Sucesso",
            message: "Anúncio cadastrado com sucesso!",
            anuncio: novoAnuncio
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: "ID de jogo inválido." });
        }
        res.status(500).json({ error: error.message });
    }
};

// Lista todos os anúncios com filtros e paginação
const listarAnuncios = async (req, res) => {
    try {
        const { plataforma, estadoConservacao, limite = 10, pagina = 1 } = req.query;

        const query = {};

        if (plataforma) {
            query.plataforma = { $regex: plataforma, $options: 'i' };
        }

        if (estadoConservacao) {
            query.estadoConservacao = estadoConservacao;
        }

        const skip = (parseInt(pagina) - 1) * parseInt(limite);

        // Busca os anúncios populando as informações do jogo associado
        const anuncios = await Listing.find(query)
            .populate('jogo')
            .skip(skip)
            .limit(parseInt(limite));

        const total = await Listing.countDocuments(query);

        res.status(200).json({
            status: "Sucesso",
            anuncios,
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

// Deleta um anúncio por ID
const deletarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;

        const anuncioDeletado = await Listing.findByIdAndDelete(id);

        if (!anuncioDeletado) {
            return res.status(404).json({ error: "Anúncio não encontrado." });
        }

        res.status(200).json({
            status: "Sucesso",
            message: "Anúncio removido com sucesso!"
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: "ID de anúncio inválido." });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    criarAnuncio,
    listarAnuncios,
    deletarAnuncio
};
