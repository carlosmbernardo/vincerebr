const { Schema, model } = require('mongoose');

const ServiceSchema = new Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    icone: { type: String },
    ordem: { type: Number, default: 0 },
    ativo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = model('Service', ServiceSchema);