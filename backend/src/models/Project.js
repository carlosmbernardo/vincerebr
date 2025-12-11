const { Schema, model } = require('mongoose');

const ProjectSchema = new Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    imagemUrl: { type: String },
    link: { type: String },
    tags: [{ type: String }],
    destaque: { type: Boolean, default: false },
    ordem: { type: Number, default: 0 },
    ativo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = model('Project', ProjectSchema);