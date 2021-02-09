import 'phaser';

import Board from '../entity/Board';
import Piece from '../entity/Piece';
import Square from '../entity/Square';
import config from '../config/config';
import RegexOption from '../entity/RegexOption';

export default class BaseScene extends Phaser.Scene {
  constructor(name) {
    super(name);
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

  assignLocations(tetrisLoc, regexLoc) {
    this.gameBoardLoc = tetrisLoc;
    this.regexBankLoc = regexLoc;
  }

  createGraphics() {
    //container border
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(10, 0xffffff, 1);
  }

  createGameBoard() {
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
    this.gameBoardHeader = this.add
      .rectangle(this.gameBoardLoc[0], 0, 300, 100, config.backgroundColor)
      .setOrigin(0)
      .setDepth(10);
    this.graphics.lineStyle(10, 0x00000, 1);
    this.graphics.strokeRectShape(this.gameBoardHeader);
    //line for top of tetris board
    this.add.rectangle(445, 101, 310, 4, 0xffffff).setOrigin(0).setDepth(11);
  }

  createRegexBoard() {
    this.regexBoard = this.add
      .rectangle(850, 105, 250, 570, this.foregroundColor)
      .setOrigin(0);
    this.graphics.strokeRectShape(this.regexBoard);
    this.regexLabel = this.add
      .text(975, 130, 'Regex Choice', {
        fontFamily: 'retroFont',
        fontSize: '20px',
      })
      .setOrigin(0.5);
    this.regexControlsDisplay = this.add
      .text(975, 160, 'Press SHIFT to switch', {
        fontFamily: 'retroFont',
        fontSize: '14px',
      })
      .setOrigin(0.5);
    this.regexOptions = this.physics.add.group({ classType: RegexOption });
    for (let i = 0; i < 5; i++) {
      this.regexOptions.add(
        new RegexOption(
          this,
          this.regexBankLoc[0] + 70,
          this.regexBankLoc[1] + 140 + 60 * i,
          i
        )
      );
    }
    this.regexChoice = this.regexOptions.getChildren()[0];
    this.regexFairy = this.physics.add
      .sprite(this.regexBankLoc[0] + 10, this.regexBankLoc[1] + 140, 'fairy')
      .setDisplaySize(55, 55)
      .setOrigin(0, 0.2);
  }

  createScoreBoard() {
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
    this.tetrisControlsDisplay = this.add.text(
      110,
      500,
      'UP = rotate\n\nDOWN = fall faster\n\nRIGHT = move right\n\nLEFT = move left',
      { fontFamily: 'retroFont', fontSize: '16px' }
    );
  }

  createNextPieceBoard() {
    this.nextPieceBoard = this.add
      .rectangle(100, 105, 250, 250, this.foregroundColor)
      .setOrigin(0);
    this.nextPieceText = this.add
      .text(225, 130, 'Up Next:', { fontFamily: 'retroFont', fontSize: '20px' })
      .setOrigin();
    this.nextPieceDisplay = this.add.image(225, 235, 'I');
    this.graphics.strokeRectShape(this.nextPieceBoard);
  }

  createTimer(fps = 1) {
    this.timer = this.physics.add
      .sprite(975, 590, 'timer', 10)
      .setDisplaySize(75, 75)
      .setVisible(false);

    this.anims.create({
      key: 'countDown',
      frames: this.anims.generateFrameNumbers('timer', { start: 2, end: 0 }),
      frameRate: fps,
      repeat: 0,
    });
  }

  createTitle() {
    this.title = this.add.sprite(600, 35, 'title').setScale(0.2).setDepth(11);
  }

  initializeGame() {
    this.foregroundColor = 0x000000;
    this.pieceCount = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.shift = this.input.keyboard.addKey('SHIFT');
    this.gameOver = false;
    this.regexScore = 0;
    this.score = 0;
    this.destroyedRows = 0;
    this.level = 0;
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

  checkRegexChoice() {
    if (Phaser.Input.Keyboard.JustUp(this.cursors.shift)) {
      if (this.regexFairy.y === this.regexBankLoc[1] + 380) {
        this.regexFairy.y = this.regexBankLoc[1] + 140;
      } else {
        this.regexFairy.y += 60;
      }
      const currentRegex = this.regexOptions
        .getChildren()
        .filter((option) => option.y === this.regexFairy.y);
      this.regexChoice = currentRegex[0];
    }
  }
}
