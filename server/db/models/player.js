const Sequelize = require('sequelize');
const db = require('../db');
const crypto = require('crypto');

const Player = db.define(
  'player',
  {
    alias: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      get() {
        return () => this.getDataValue('password');
      },
    },
    salt: {
      type: Sequelize.STRING,
      // Making `.salt` act like a function hides it when serializing to JSON.
      // This is a hack to get around Sequelize's lack of a "private" option.
      get() {
        return () => this.getDataValue('salt');
      },
    },
  },
  { timestamps: false }
);

module.exports = Player;

/**
 * instanceMethods
 */
Player.prototype.correctPassword = function (candidatePwd) {
  return Player.encryptPassword(candidatePwd, this.salt()) === this.password();
};

/**
 * classMethods
 */
Player.generateSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};

Player.encryptPassword = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex');
};

/**
 * hooks
 */
const setSaltAndPassword = (player) => {
  if (player.changed('password')) {
    player.salt = Player.generateSalt();
    player.password = Player.encryptPassword(player.password(), player.salt());
  }
};

// change all aliases to lowercase before save
Player.beforeCreate((player) => {
  player.alias = player.alias.toLowerCase();
});

Player.beforeCreate(setSaltAndPassword);
Player.beforeUpdate(setSaltAndPassword);
Player.beforeBulkCreate((players) => {
  players.forEach(setSaltAndPassword);
});
