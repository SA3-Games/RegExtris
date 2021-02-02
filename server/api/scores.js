const router = require("express").Router();
const { Score } = require("../db/score");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const scores = await Score.findAll({
      attributes: ["tetrisScore", "regExScore"],
    });
    res.json(scores);
  } catch (error) {
    next(error);
  }
});
