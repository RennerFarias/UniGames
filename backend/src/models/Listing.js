const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    jogo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: [true, 'O jogo associado é obrigatório.']
    },
    preco: {
        type: Number,
        required: [true, 'O preço do anúncio é obrigatório.'],
        min: [0, 'O preço não pode ser negativo.']
    },
    estadoConservacao: {
        type: String,
        required: [true, 'O estado de conservação é obrigatório.'],
        enum: {
            values: ['Novo', 'Excelente', 'Bom', 'Marcas de Uso'],
            message: 'Estado de conservação inválido. Escolha entre: Novo, Excelente, Bom, Marcas de Uso.'
        }
    },
    plataforma: {
        type: String,
        required: [true, 'A plataforma da mídia física é obrigatória.']
    },
    contato: {
        nome: {
            type: String,
            required: [true, 'O nome do anunciante é obrigatório.']
        },
        info: {
            type: String,
            required: [true, 'A informação de contato (e-mail ou telefone) é obrigatória.']
        }
    },
    descricao: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;
