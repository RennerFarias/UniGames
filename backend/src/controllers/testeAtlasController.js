// ISSO É UM ARQUIVO TESTE E SERÁ APAGADO DEPOIS!!!!!!!!!!!!
// criei esse Model temporário para testar a gravação no
// banco de dados no atlasdb
// DELETAR DEPOIS DE TESTAR
// OBRIGADO!!!!!!!!!!!!!!!!!!!!!!

const mongoose = require('mongoose');

const TesteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    criadoEm: { type: Date, default: Date.now }
});

const TesteModel = mongoose.models.Teste || mongoose.model('Teste', TesteSchema);

const testarConexao = async (req, res) => {
    try {
        res.status(200).json({ 
            status: "OK", 
            message: "Conexão com o MongoDB Atlas testada e funcionando com sucesso!" 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const enviarDado = async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ error: "O campo 'nome' é obrigatório." });
        }

        const novoRegistro = new TesteModel({ nome });
        await novoRegistro.save();

        res.status(201).json({
            status: "Sucesso",
            message: "Dado gravado no MongoDB Atlas!",
            dado: novoRegistro
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    testarConexao,
    enviarDado,
};
