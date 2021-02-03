import store from '../store';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score;
  }

  preload() {}

  create() {
    this.reduxState = store.getState();
    this.regexChoices = this.reduxState.regexChoices;
    this.enter = this.input.keyboard.addKey('ENTER');

    this.add.text(
      10,
      10,
      `GAME OVER.\n\nFinal Score: ${this.finalScore}\n\nPress enter to go back to the menu!`
    );
    this.add.text(
      10,
      200,
      `Here are your RegEx stats:\n\nExpression        Times Used        Total Matched Characters`
    );

    Object.keys(this.regexChoices).forEach((re, index) => {
      this.add.text(
        10,
        275 + 25 * index,
        `${re}                ${this.regexChoices[re].timesUsed}                 ${this.regexChoices[re].totalCharacters}`
      );
    });
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      this.scene.start('MenuScene');
    }
  }
}
