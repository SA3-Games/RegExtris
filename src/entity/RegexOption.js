import 'phaser';

export default class RegexOption extends Phaser.GameObjects.Text {
  constructor(scene, x, y, re) {
    super(scene, x, y, `${re}`, { fontSize: '30px' });

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.re = re;
  }
}
