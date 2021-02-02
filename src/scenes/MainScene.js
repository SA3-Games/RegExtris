import 'phaser';
//import BaseScene from './BaseScene';
import Board from '../entity/Board';
import Piece from '../entity/Piece';
import Square from '../entity/Square';
import config from '../config/config';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('square', 'assets/sprites/square.png');
  }

  create() {
    this.pieceCount = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.over = false;
    this.score = 0;
    this.destroyedRows = 0;
    this.level = 0;
    //move board to center of page
    this.gameBoardLoc = [450, 70];

    //visual "containers" for game displays
    this.gameBoard = this.add
      .rectangle(this.gameBoardLoc[0], this.gameBoardLoc[1], 300, 600, 0x000000)
      .setOrigin(0);
    this.regexBoard = this.add
      .rectangle(850, 100, 250, 570, 0x000000)
      .setOrigin(0);
    this.scoreBoard = this.add
      .rectangle(100, 370, 250, 300, 0x000000)
      .setOrigin(0);
    this.nextPieceBoard = this.add
      .rectangle(100, 100, 250, 250, 0x000000)
      .setOrigin(0);
    this.gameBoardHeader = this.add
      .rectangle(
        this.gameBoardLoc[0],
        this.gameBoardLoc[1] - 100,
        300,
        130,
        config.backgroundColor
      )
      .setOrigin(0)
      .setDepth(10);

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
  }
}
