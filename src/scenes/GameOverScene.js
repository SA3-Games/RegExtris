export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score;
  }

  preload() {}

  create() {
    this.enter = this.input.keyboard.addKey('ENTER');

    this.add.text(
      10,
      10,
      `GAME OVER.\n\nFinal Score: ${this.finalScore}\n\nPress enter to go back to the menu!`
    );
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      this.scene.start('MenuScene');
    }
  }
}
