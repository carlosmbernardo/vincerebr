const { Schema, model } = require('mongoose');
const LeadSchema = new Schema(
  {
  nome: { type: String, required: true },
  email: { type: String, required: true },
  telefone: { type: String },
  mensagem: { type: String, required: true },
  origem: { type: String, default: 'site' },
  status: { type: String, enum: ['novo', 'contatado', 'qualificado', 'descartado'], default: 'novo' }
  },
  { timestamps: true }
);

module.exports = model('Lead', LeadSchema);