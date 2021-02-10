import 'phaser';

export default class LearnModeTutorial extends Phaser.Scene {
  constructor() {
    super('LearnModeTutorial');
  }
  preload() {
    this.load.image('LMT1', 'assets/sprites/LearnModeTutorial1.png');
    this.load.image('LMT2', 'assets/sprites/LearnModeTutorial2.png');
    this.load.image('LMT3', 'assets/sprites/LearnModeTutorial3.png');
  }

  create() {
    this.enter = this.input.keyboard.addKey('ENTER');

    this.add.image(600, 350, 'LMT3');
    this.add.image(600, 350, 'LMT2');
    this.add.image(600, 350, 'LMT1');

    this.add.text(600, 90, "press enter to start learn mode", {
      fontFamily: "retroFont",
      fontSize: 20,
      color: "#7a8bf4"
    }).setOrigin(0.5);
  }

  update() {
    if (this.enter.isDown) {
      this.scene.start('LearnMode');
    }

  }
}
