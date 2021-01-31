const Player = require("./player");
const Score = require("./score");
const Session = require("./session");

Player.hasMany(Score);
Score.belongsTo(Player);

Player.belongsToMany(Session, { through: "sessionPlayers" });
Session.belongsToMany(Player, { through: "sessionPlayers" });

Score.belongsToMany(Session, { through: "sessionScores" });
Session.belongsToMany(Score, { through: "sessionScores" });

module.exports = { Player, Score, Session };
