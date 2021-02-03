const router = require("express").Router();
const { Player } = require("./db");
module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    console.log("req.bdoy in /auth/login", req.body);
    const player = await Player.findOne({
      where: {
        alias: req.body.alias,
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
    const { alias, password } = req.body;
    const player = await Player.create({ alias, password });
    req.login(player, (err) => (err ? next(err) : res.json(player)));
  } catch (err) {
    if (err.alias === "SequelizeUniqueConstraintError") {
      res.status(401).send("This alias already exists");
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
  res.json(req.user);
});

module.exports = router;
