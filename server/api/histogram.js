const router = require('express').Router();
const { Score } = require('../db');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const histData = await Score.makeHistogram();
    res.send(histData);
  } catch (error) {
    next(error);
  }
});
