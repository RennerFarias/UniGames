const PriceOffer = require('../models/PriceOffer');

const obterOfertasDestaque = async (req, res) => {
  try {
    const ofertas = await PriceOffer.find()
      .populate('jogo')
      .sort({ descontoPercentual: -1 })
      .limit(10);

    res.status(200).json({
      status: 'Sucesso',
      total: ofertas.length,
      ofertas,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao buscar ofertas em destaque',
      erro: error.message,
    });
  }
};

const obterHistoricoPrecos = async (req, res) => {
  try {
    const { jogoId } = req.params;

    const ofertas = await PriceOffer.find({ jogo: jogoId }).populate('jogo');

    if (!ofertas || ofertas.length === 0) {
      return res.status(404).json({
        mensagem: 'Nenhum histórico de preço encontrado para este jogo.',
      });
    }

    res.status(200).json({
      status: 'Sucesso',
      ofertas,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ mensagem: 'ID de jogo inválido.' });
    }
    res.status(500).json({
      mensagem: 'Erro ao obter histórico de preços',
      erro: error.message,
    });
  }
};

module.exports = {
  obterOfertasDestaque,
  obterHistoricoPrecos,
};
