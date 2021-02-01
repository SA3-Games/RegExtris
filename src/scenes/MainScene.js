import "phaser";
//import BaseScene from './BaseScene';
import Board from "../entity/Board";
import Piece from "../entity/Piece";

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
    //this.gameMap = Array(20).fill(Array(10).fill(0));
    this.board = new Board(this, this.gameMap);
    const piece = new Piece(this, Phaser.Math.RND.integerInRange(0, 6));
    this.board.pieces.push(piece);
  }
  update() {
    this.piece = this.board.pieces[this.board.pieces.length - 1];
    this.piece.update();
  }
}
