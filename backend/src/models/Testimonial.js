const { Schema, model } = require('mongoose');

const TestimonialSchema = new Schema(
  {
    nome: { type: String, required: true },
    cargo: { type: String },
    empresa: { type: String },
    mensagem: { type: String, required: true },
    avatarUrl: { type: String },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    ativo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = model('Testimonial', TestimonialSchema);