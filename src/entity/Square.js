import 'phaser';

export default class Square extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    //attach random character for RegEx mechanics
    //[char, frame number]
    this.setRandomCharacter();
  }

  setRandomCharacter () {
    const randomCharacter = Phaser.Math.RND.pick([
      [' ', 0],
      ['A', 1],
      ['B', 2],
      ['F', 3],
      ['N', 4],
      ['a', 5],
      ['b', 6],
      ['f', 7],
      ['n', 8],
      ['2', 9],
      ['3', 10],
      ['4', 11],
      ['5', 12],
      ['$', 13],
      ['?', 14],
      ['#', 15],
      ['()', 16],
      ['[]', 17],
      ['/', 18],
      ['+', 19]
    ]);
    this.character = randomCharacter[0];
    this.setTexture('square', randomCharacter[1]);
  }

  //reset sprite for reuse
  reset(color) {
    this.setRandomCharacter();  
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(0, 0);
    return this;
  }
}
