const mongoose = require('mongoose');
const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    foto: { type: String, default: '' },
    senha: { type: String, required: true },
    dataNascimento: { type: Date, required: false },
    revendedor: { type: Boolean, default: false },
    perfil: {
      type: String,
      enum: ['usuario', 'admin'],
      default: 'usuario',
    },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model('User', usuarioSchema);
module.exports = User;
