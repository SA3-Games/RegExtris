const router = require('express').Router();

module.exports = router;

router.use('/scores', require('./scores'));
router.use('/players', require('./players'));
router.use('/histogram', require('./histogram'));
