import "phaser";
//import BaseScene from './BaseScene';
import Board from "../entity/Board";
import Piece from "../entity/Piece";
import Block from "../entity/Block";

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
    this.board = new Board(this);
    const piece = new Piece(
      this,
      Phaser.Math.RND.pick(["I", "J", "L", "O", "S", "T", "Z"])
    );
    this.pieces.add(piece);
  }
  update() {
    this.piece = this.pieces.getLast(true);
    this.piece.update();
  }
}
