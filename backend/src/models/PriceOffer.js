const mongoose = require('mongoose');

const HistoricoPrecoSchema = new mongoose.Schema({
    preco: { type: Number, required: true },
    data: { type: Date, default: Date.now }
});

const PriceOfferSchema = new mongoose.Schema({
    jogo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: [true, 'O jogo associado é obrigatório.']
    },
    loja: {
        type: String,
        required: [true, 'O nome da loja é obrigatório.'],
        trim: true
    },
    preco: {
        type: Number,
        required: [true, 'O preço é obrigatório.'],
        min: [0, 'O preço não pode ser negativo.']
    },
    precoOriginal: {
        type: Number,
        min: [0, 'O preço original não pode ser negativo.']
    },
    descontoPercentual: {
        type: Number,
        default: 0
    },
    urlLoja: {
        type: String,
        trim: true
    },
    historicoPrecos: [HistoricoPrecoSchema]
}, {
    timestamps: true
});

const PriceOffer = mongoose.model('PriceOffer', PriceOfferSchema);

module.exports = PriceOffer;
