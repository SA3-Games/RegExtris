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
    this.load.spritesheet('square', 'assets/spritesheets/WHITEtetrominos.png', {
      frameWidth: 28,
      frameHeight: 28,
    });
    this.load.spritesheet('timer', 'assets/spritesheets/timer.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.image('fairy', 'assets/menuSprites/FAIRY.png');
    this.load.image('title', 'assets/spritesheets/REGEXTRISbw.png');
    this.load.image('I', 'assets/sprites/0.png');
    this.load.image('J', 'assets/sprites/1.png');
    this.load.image('L', 'assets/sprites/2.png');
    this.load.image('O', 'assets/sprites/3.png');
    this.load.image('S', 'assets/sprites/4.png');
    this.load.image('T', 'assets/sprites/5.png');
    this.load.image('Z', 'assets/sprites/6.png');
  }

  create() {
    this.foregroundColor = 0x000000;
    this.pieceCount = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.shift = this.input.keyboard.addKey('SHIFT');
    this.gameOver = false;
    this.regexScore = 0;
    this.score = 0;
    this.destroyedRows = 0;
    this.level = 0;

    //container border
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(10, 0xffffff, 1);

    //move board to center of page
    this.gameBoardLoc = [450, 70];
    this.regexBankLoc = [850, 100];

    //visual "containers" for game displays
    this.gameBoard = this.add
      .rectangle(
        this.gameBoardLoc[0],
        this.gameBoardLoc[1],
        300,
        600,
        this.foregroundColor
      )
      .setOrigin(0);
    this.graphics.strokeRectShape(this.gameBoard);

    this.regexBoard = this.add
      .rectangle(850, 100, 250, 570, this.foregroundColor)
      .setOrigin(0);
    this.graphics.strokeRectShape(this.regexBoard);
    this.regexContolsDisplay = this.add.text(
      860,
      110,
      'Press SHIFT to switch',
      {
        fontFamily: 'retroFont',
        fontSize: '14px',
      }
    );
    // this.regexContolsDisplay = this.add.text(
    //   860,
    //   140,
    //   'to change RegEx choice',
    //   { fontFamily: 'retroFont', fontSize: '14px' }
    // );
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

    this.regexChoice = this.regexOptions.getChildren()[0].re;

    this.regexFairy = this.physics.add
      .sprite(this.regexBankLoc[0] + 10, this.regexBankLoc[1] + 50, 'fairy')
      .setDisplaySize(45, 45)
      .setOrigin(0);

    this.scoreBoard = this.add
      .rectangle(100, 370, 250, 300, this.foregroundColor)
      .setOrigin(0);
    this.graphics.strokeRectShape(this.scoreBoard);
    this.scoreDisplay = this.add.text(
      110,
      400,
      `Tetris Score: ${this.score}\n\nRegEx Score: ${this.regexScore}`,
      { fontFamily: 'retroFont', fontSize: '16px' }
    );

    this.nextPieceBoard = this.add
      .rectangle(100, 100, 250, 250, this.foregroundColor)
      .setOrigin(0);
    this.nextPieceText = this.add
      .text(225, 130, 'Up Next:', { fontFamily: 'retroFont', fontSize: '20px' })
      .setOrigin();
    this.nextPieceDisplay = this.add.image(225, 225, 'I');
    this.graphics.strokeRectShape(this.nextPieceBoard);
    this.tetrisContolsDisplay = this.add.text(
      110,
      500,
      'UP = rotate\n\nDOWN = fall faster\n\nRIGHT = move right\n\nLEFT = move left',
      { fontFamily: 'retroFont', fontSize: '16px' }
    );
    this.gameBoardHeader = this.add
      .rectangle(this.gameBoardLoc[0], 0, 300, 90, config.backgroundColor)
      .setOrigin(0)
      .setDepth(10);
    this.graphics.lineStyle(10, 0x00000, 1);
    this.graphics.strokeRectShape(this.gameBoardHeader);

    this.timer = this.physics.add
      .sprite(975, 600, 'timer', 10)
      .setDisplaySize(75, 75)
      .setVisible(false);

    this.anims.create({
      key: 'countDown',
      frames: this.anims.generateFrameNumbers('timer', { start: 2, end: 0 }),
      frameRate: 1,
      repeat: 0,
    });

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

    //title display
    this.title = this.add.sprite(600, 35, 'title').setScale(0.2).setDepth(11);
  }
  update() {
    //only update most recently created piece
    if (Phaser.Input.Keyboard.JustUp(this.cursors.shift)) {
      if (this.regexFairy.y === this.regexBankLoc[1] + 400) {
        this.regexFairy.y = this.regexBankLoc[1] + 50;
      } else {
        this.regexFairy.y += 50;
      }
      const currentRegex = this.regexOptions
        .getChildren()
        .filter((option) => option.y === this.regexFairy.y);
      this.regexChoice = currentRegex[0].re;
    }
    this.piece = this.pieces.getLast(true);
    this.piece.update();
    this.scoreDisplay.setText(
      `Tetris Score: ${this.score}\n\nRegEx Score: ${this.regexScore}`
    );
  }
}
