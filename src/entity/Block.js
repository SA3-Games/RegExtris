import 'phaser';

export default class Block extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'block');

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
}
