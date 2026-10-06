const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: true,
      enum: ['buscas_frequentes', 'variacao_precos', 'atividade_usuarios', 'ofertas_destaque'],
    },
    dados: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    descricao: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
