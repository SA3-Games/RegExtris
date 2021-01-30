import 'phaser';

export default class Block extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
}
