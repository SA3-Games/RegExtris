import 'phaser';

export default class RegexOption extends Phaser.GameObjects.BitmapText {
  constructor(scene, x, y, re) {
    super(scene, x, y, 'retro-computer', `${re}`);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.re = re;
  }
}
