const path = require("path");
const express = require("express");
const session = require("express-session");
const compression = require("compression");
const morgan = require("morgan");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
const { db } = require("./db");
const sessionStore = new SequelizeStore({ db });
const PORT = process.env.PORT || 8080;

const app = express();

// passport registration
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.player.findByPk(id);
    done(null, player);
  } catch (err) {
    done(err);
  }
});

// logging middleware
app.use(morgan("dev"));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "regExtris is best tetris",
    store: sessionStore,
    resave: false,
    saveUninitializated: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/auth", require("./auth"));

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/index.html"));
});

// handle 404 errors
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handling endware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || "Internal server error");
});

db.sync();

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});
