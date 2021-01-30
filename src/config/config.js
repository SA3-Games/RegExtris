export default {
  type: Phaser.AUTO,
  width: window.innerHeight * 0.45,
  height: window.innerHeight * 0.9,
  parent: 'game',
  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true,
    },
  },
};
