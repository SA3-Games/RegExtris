import 'phaser';

export default class Square extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'square');

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.character = Phaser.Math.RND.pick([
      'a',
      'b',
      'A',
      'B',
      '3',
      '7',
      '#',
      '$',
      ' ',
    ]);
  }

  reset(color) {
    this.character = Phaser.Math.RND.pick([
      'a',
      'b',
      'A',
      'B',
      '3',
      '7',
      '#',
      '$',
      ' ',
    ]);
    this.setTexture('square');
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(0, 0);
    return this;
  }
}
