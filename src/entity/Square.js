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

  setRandomCharacter() {
    const randomCharacter = Phaser.Math.RND.pick([
      [' ', 0],
      ['A', 1],
      ['D', 2],
      ['F', 3],
      ['W', 4],
      ['a', 5],
      ['d', 6],
      ['f', 7],
      ['w', 8],
      ['1', 9],
      ['2', 10],
      ['3', 11],
      ['4', 12],
      ['$', 13],
      ['?', 14],
      ['#', 15],
      ['()', 16],
      ['*', 17],
      ['/', 18],
      ['-', 19],
    ]);
    this.character = randomCharacter[0];
    this.setTexture('square', randomCharacter[1]);
  }

  //reset sprite for reuse
  reset() {
    this.setRandomCharacter();
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(600, 50);
    return this;
  }
}
