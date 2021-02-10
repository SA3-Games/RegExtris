import 'phaser';

export default class LearnModeTutorial extends Phaser.Scene {
  constructor() {
    super('MainTutorial');
  }
  preload() {
    this.load.image('MT1', 'assets/sprites/MainTutorial1.png');
    this.load.image('MT2', 'assets/sprites/MainTutorial2.png');
    this.load.image('MT3', 'assets/sprites/MainTutorial3.png');
  }
}
