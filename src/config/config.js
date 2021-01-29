export default {
  type: Phaser.AUTO, // Specify the underlying browser rendering engine (AUTO, CANVAS, WEBGL)
  // AUTO will attempt to use WEBGL, but if not available it'll default to CANVAS
  width: 800, // Game width in pixels
  height: 600, // Game height in pixels

  render: {
    pixelArt: true,
  },
  //  We will be expanding physics later
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500 },
      debug: true,
    },
  },
};
