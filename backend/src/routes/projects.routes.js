const router = require('express').Router();
const asyncHandler = require('../middlewares/asyncHandler');
const ctrl = require('../controllers/projects.controller');

// LISTAR
router.get('/', asyncHandler(ctrl.listar));

// CRIAR
router.post('/', asyncHandler(ctrl.criar));

// ATUALIZAR
router.put('/:id', asyncHandler(ctrl.atualizar));

// DELETAR
router.delete('/:id', asyncHandler(ctrl.deletar));

module.exports = router;
