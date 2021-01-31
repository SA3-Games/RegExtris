const Sequelize = require("sequelize");
const db = require("../db");

const Session = db.define("session", {});

module.exports = Session;
