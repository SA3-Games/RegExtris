import 'phaser';
//import BaseScene from './BaseScene';

import Board from '../entity/Board';
import Piece from '../entity/Piece';
import Square from '../entity/Square';
import config from '../config/config';
import RegexOption from '../entity/RegexOption';

const regexData = [
  /[abfn]/,
  /[ABFN]/,
  /\d/,
  /[^abfn]/,
  /[^ABFN]/,
  /\D/,
  /\s/,
  /[^\w\d\s]/,
];

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.spritesheet('square', 'assets/spritesheets/GREYtetrominos.png', {
      frameWidth: 288,
      frameHeight: 288,
    });
    this.load.image('fairy', 'assets/menuSprites/FAIRY.png');
  }

  create() {
    this.pieceCount = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.gameOver = false;
    this.regexScore = 0;
    this.score = 0;
    this.destroyedRows = 0;
    this.level = 0;
    this.regexChoice = null;
    //move board to center of page
    this.gameBoardLoc = [450, 70];
    this.regexBankLoc = [850, 100];

    //visual "containers" for game displays
    this.gameBoard = this.add
      .rectangle(this.gameBoardLoc[0], this.gameBoardLoc[1], 300, 600, 0x000000)
      .setOrigin(0);
    this.regexBoard = this.add
      .rectangle(850, 100, 250, 570, 0x000000)
      .setOrigin(0);
    this.regexOptions = this.physics.add.group({ classType: RegexOption });
    regexData.forEach((re, idx) => {
      this.regexOptions.add(
        new RegexOption(
          this,
          this.regexBankLoc[0] + 50,
          this.regexBankLoc[1] + 50 * (idx + 1),
          re
        )
      );
    });
    this.regexFairy = this.physics.add
      .sprite(this.regexBankLoc[0] + 10, this.regexBankLoc[1] + 50, 'fairy')
      .setDisplaySize(45, 45)
      .setOrigin(0);

    this.scoreBoard = this.add
      .rectangle(100, 370, 250, 300, 0x000000)
      .setOrigin(0);
    this.scoreDisplay = this.add.text(
      150,
      400,
      `Tetris Score: ${this.score}\n\nRegEx Score: ${this.regexScore}`
    );

    this.nextPieceBoard = this.add
      .rectangle(100, 100, 250, 250, 0x000000)
      .setOrigin(0);
    this.gameBoardHeader = this.add
      .rectangle(this.gameBoardLoc[0], 0, 300, 90, config.backgroundColor)
      .setOrigin(0)
      .setDepth(10);

    //overlaps
    this.physics.add.overlap(
      this.regexFairy,
      this.regexOptions,
      (fairy, option) => {
        this.regexChoice = option.re;
        console.log(this.regexChoice);
      },
      (fairy, option) => option.re !== this.regexChoice
    );

    //groups for pieces
    this.pieces = this.physics.add.group({ classType: Piece });
    //group for landed squares
    this.squares = this.physics.add.group({ classType: Square });
    //methods and data for game board grid
    this.board = new Board(this);
    //create first piece
    this.pieces.add(
      new Piece(this, Phaser.Math.RND.pick(['I', 'J', 'L', 'O', 'S', 'T', 'Z']))
    );
  }
  update() {
    //only update most recently created piece
    this.piece = this.pieces.getLast(true);
    this.piece.update();
    this.scoreDisplay.setText(
      `Tetris Score: ${this.score}\n\nRegEx Score: ${this.regexScore}`
    );
  }
}
