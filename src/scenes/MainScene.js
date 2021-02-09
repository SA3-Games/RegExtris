import 'phaser';
import BaseScene from './BaseScene';

export default class MainScene extends BaseScene {
  constructor() {
    super('MainScene');
  }

  create() {
    //pixel location for top left corner of game and regex boards
    this.assignLocations([450, 70], [850, 100]);

    this.createGameBoard();

    this.createRegexBoard();

    this.createScoreBoard();

    this.createNextPieceBoard();

    this.createBorders();

    this.createTimer();

    this.createTitle();

    this.initializeGame();
  }

  update() {
    this.checkRegexChoice();
    //only update most recently created piece
    this.piece = this.pieces.getLast(true);
    this.piece.update();
    this.scoreDisplay.setText(
      `Tetris Score: ${this.score}\n\nRegEx Score: ${this.regexScore}`
    );
  }
}
