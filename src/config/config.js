export default {
  type: Phaser.AUTO,
  width: 500,
  height: 1000,
  parent: 'game',
  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      //debug: true,
    },
  },
};
