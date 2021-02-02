import "phaser";
//import BaseScene from './BaseScene';

import Board from '../entity/Board';
import Piece from '../entity/Piece';
import Block from '../entity/Block';
import config from '../config/config';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("block", "assets/sprites/square.png");
  }

  create() {
    this.pieceCount = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.over = false;
    //do l8r
    this.score = 0;
    this.lines = 0;
    this.level = 0;
    this.pieces = this.physics.add.group({ classType: Piece });
    this.blocks = this.physics.add.group({ classType: Block });
    this.gameBoardLoc = [450, 70];
    this.gameBoard = this.add
      .rectangle(this.gameBoardLoc[0], this.gameBoardLoc[1], 300, 600, 0x3f4542)
      .setOrigin(0);
    this.regexBoard = this.add
      .rectangle(850, 100, 250, 570, 0x3f4542)
      .setOrigin(0);
    this.scoreBoard = this.add
      .rectangle(100, 370, 250, 300, 0x3f4542)
      .setOrigin(0);
    this.nextPieceBoard = this.add
      .rectangle(100, 100, 250, 250, 0x3f4542)
      .setOrigin(0);
    this.board = new Board(this, 300, 0, [
      ...this.pieces.getChildren(),
      ...this.blocks.getChildren(),
      this.rect,
    ]);
    const piece = new Piece(
      this,
      Phaser.Math.RND.pick(["I", "J", "L", "O", "S", "T", "Z"])
    );
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
    this.pieces.add(piece);
  }
  update() {
    this.piece = this.pieces.getLast(true);
    this.piece.update();
  }
}
