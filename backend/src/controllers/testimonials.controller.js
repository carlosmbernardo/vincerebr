const Testimonial = require('../models/Testimonial');

exports.listar = async (req, res) => {
  const itens = await Testimonial.find({ ativo: true }).sort({ createdAt: -1 });
  res.json(itens);
};