const Player = require('./player');
const Score = require('./score');

Player.hasMany(Score);
Score.belongsTo(Player);

module.exports = { Player, Score };
