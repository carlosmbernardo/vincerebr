const router = require('express').Router();
const asyncHandler = require('../middlewares/asyncHandler');
const ctrl = require('../controllers/services.controller');

router.get('/', asyncHandler(ctrl.listar));

module.exports = router;