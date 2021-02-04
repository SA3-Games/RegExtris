const router = require("express").Router();
const { Player } = require("../db");
module.exports = router;

// get all players
router.get("/", async (req, res, next) => {
  try {
    const users = await Player.findAll({
      attributes: ["id", "alias"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// get specific player
router.get("/:id", async (req, res, next) => {
  try {
    const user = await Player.findByPk(req.params.id);
    res.send(user);
  } catch (err) {
    next(err);
  }
});
