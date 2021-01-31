const Sequelize = require("sequelize");
const db = require("../db");

const Score = db.define(
  "score",
  {
    tetrisScore: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    regExScore: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  { timestamps: false }
);

module.exports = Score;
