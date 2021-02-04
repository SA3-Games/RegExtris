export default {
  type: Phaser.AUTO,
  width: 1200,
  height: 700,
  parent: 'game',
  dom: {
    createContainer: true,
  },
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
