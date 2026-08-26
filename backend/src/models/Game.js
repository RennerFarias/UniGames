const mongoose = require('mongoose');

const JogoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'O título do jogo é obrigatório.'],
        trim: true
    },
    descricao: {
        type: String,
        trim: true
    },
    generos: {
        type: [String],
        default: []
    },
    plataformas: {
        type: [String],
        default: []
    },
    imagemCapa: {
        type: String,
        trim: true
    },
    linksReferencia: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const Game = mongoose.model('Game', JogoSchema);

module.exports = Game;
