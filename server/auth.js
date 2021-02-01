const router = require("express").Router();
const { Player } = require("./db");
module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    const player = await Player.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!player) {
      res.status(401).send("No such player found");
    } else if (!player.correctPassword(req.body.password)) {
      res.status(401).send("Wrong password for this player");
    } else {
      req.login(player, (err) => (err ? next(err) : res.json(player)));
    }
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const player = await Player.create({ email, password });
    req.login(player, (err) => (err ? next(err) : res.json(player)));
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("Player already exists");
    } else {
      next(err);
    }
  }
});

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/me", (req, res) => {
  res.json(req.player);
});

module.exports = router;
