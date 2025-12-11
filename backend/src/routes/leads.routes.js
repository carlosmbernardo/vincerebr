const router = require('express').Router();
const asyncHandler = require('../middlewares/asyncHandler');
const ctrl = require('../controllers/leads.controller');

router.post('/', asyncHandler(ctrl.criar));

module.exports = router;