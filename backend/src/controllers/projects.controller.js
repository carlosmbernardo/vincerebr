const Project = require('../models/Project');

// LISTAR
exports.listar = async (req, res) => {
  const itens = await Project.find({ ativo: true }).sort({ destaque: -1, ordem: 1 });
  res.json(itens);
};

// CRIAR
exports.criar = async (req, res) => {
  try {
    const novo = await Project.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// ATUALIZAR
exports.atualizar = async (req, res) => {
  try {
    const atualizado = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ erro: "Projeto não encontrado" });
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// DELETAR
exports.deletar = async (req, res) => {
  try {
    const removido = await Project.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ erro: "Projeto não encontrado" });
    res.json({ mensagem: "Projeto removido com sucesso" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
