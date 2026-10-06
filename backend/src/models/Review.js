const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    avaliador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'O usuário avaliador é obrigatório.'],
    },
    avaliadoUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    jogo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
    nota: {
      type: Number,
      required: [true, 'A nota de 1 a 5 é obrigatória.'],
      min: [1, 'Nota mínima é 1.'],
      max: [5, 'Nota máxima é 5.'],
    },
    comentario: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
