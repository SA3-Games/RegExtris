export default {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  parent: 'game',
  render: {
    pixelArt: true,
  },
  backgroundColor: 0x7c7ac1,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      //debug: true,
    },
  },
};
