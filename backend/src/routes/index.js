const router = require('express').Router();

router.use('/services', require('./services.routes'));
router.use('/projects', require('./projects.routes'));
router.use('/testimonials', require('./testimonials.routes'));
router.use('/leads', require('./leads.routes'));

module.exports = router;
