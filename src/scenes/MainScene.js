import "phaser";
import BaseScene from "./BaseScene";

export default class MainScene extends BaseScene {
  constructor() {
    super("MainScene");
    this.mode = "normal";
  }

  create() {
    //pixel location for top left corner of game and regex boards
    this.assignLocations([450, 70], [850, 100]);

    this.createGameBoard(...this.gameBoardLoc);

    this.createRegexBoard(...this.regexBankLoc);

    this.createScoreBoard();

    this.createNextPieceBoard();

    this.createBorders([
      this.gameBoard,
      this.regexBoard,
      this.scoreBoard,
      this.nextPieceBoard,
    ]);

    this.createTimer(975, 590);

    this.createTitle();
    this.add
      .text(600, 80, 'press esc to return to menu', {
        fontFamily: 'retroFont',
        fontSize: 20,
        color: '#7a8bf4',
      })
      .setOrigin(0.5)
      .setDepth(12);

    this.sound.add("chimes").setLoop(true).play();

    this.initializeGame();
  }

  update() {
    this.checkRegexChoice();
    //only update most recently created piece
    this.piece = this.pieces.getLast(true);
    this.piece.update();
    this.scoreDisplay.setText(
      `Tetris Score:\n\n${this.score}\n\n\nRegEx Score:\n\n${this.regexScore}`
    );
    this.returnToMenu();
  }
}
