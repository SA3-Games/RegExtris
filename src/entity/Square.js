import 'phaser';

export default class Square extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'square');

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    //attach random character for RegEx mechanics
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

  //reset sprite for reuse
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
    this.setTexture('square'); //**will eventually have multiple textures to pick from**
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(0, 0);
    return this;
  }
}
