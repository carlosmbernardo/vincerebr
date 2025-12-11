const Service = require('../models/Service');

exports.listar = async (req, res) => {
  const itens = await Service.find({ ativo: true }).sort({ ordem: 1, createdAt: -1 });
  res.json(itens);
};