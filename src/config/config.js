import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

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
  backgroundColor: 0x000000,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
    },
  },
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI',
      },
    ],
  },
};
