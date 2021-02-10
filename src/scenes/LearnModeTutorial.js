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
}
