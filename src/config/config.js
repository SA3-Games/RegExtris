export default {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  parent: 'game',
  render: {
    pixelArt: true,
  },
  backgroundColor: 0xb7ede6,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true,
    },
  },
};
