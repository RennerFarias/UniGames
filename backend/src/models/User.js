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
const User = mongoose.model('User', usuarioSchema);
module.exports = User;