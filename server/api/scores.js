const router = require("express").Router();
const { Score } = require("../db");
module.exports = router;

// fetch all scores in the database
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

// save the current game score to the database
router.post("/:playerId", async (req, res, next) => {
  try {
    console.log("inside /api/scores", req.params.playerId);
    await Score.create({
      playerId: req.params.playerId,
      tetrisScore: req.body.tetrisScore,
      regExScore: req.body.regExScore,
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// fetch a player's score history by the player's id
router.get("/:playerId", async (req, res, next) => {
  try {
    const scores = await Score.findAll({
      where: { playerId: req.params.playerId },
      attributes: ["createdAt", "tetrisScore", "regExScore"],
    });
    if (scores.length) {
      res.send(scores);
    } else {
      res.send(404).send("Player does not have any scores on record");
    }
  } catch (error) {
    next(error);
  }
});
