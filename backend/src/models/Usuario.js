const mongoose = require('mongoose');
const usuarioSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        senha: { type: String, required: true },
        perfil: {
            type: String, enum: ['usuario', 'admin'], default:
                'usuario'
        }
    },
    {
        timestamps: true
    }
);
const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;