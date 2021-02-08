import store from "../store";
import { postScore } from "../store/score";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
    this.scorePosted = false;
  }

  init(data) {
    this.tetrisScore = data.tetrisScore || 0;
    this.regExScore = data.regExScore || 0;
  }

  preload() {
    this.load.image('title', 'assets/spritesheets/REGEXTRISbw.png');
  }

  create() {
    this.reduxState = store.getState();
    this.regexChoices = this.reduxState.regexChoices;

    if (!this.scorePosted) {
      store.dispatch(
        postScore({
          tetrisScore: this.tetrisScore,
          regExScore: this.regExScore,
        })
      );
      this.scorePosted = true;
    }

    this.enter = this.input.keyboard.addKey("ENTER");

    this.add.text(
      10,
      10,
      `GAME OVER.\n\nFinal Tetris Score: ${this.tetrisScore}\n\nFinal RegEx Score: ${this.regExScore}\n\nPress enter to go back to the menu!`
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

    //title display
    this.title = this.add.sprite(600, 35, 'title').setScale(0.2).setDepth(11);
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      this.scene.start("MenuScene");
    }
  }
}
