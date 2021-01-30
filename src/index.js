import Phaser from 'phaser';
import config from './config/config';
import Board from './entity/Board';
import Piece from './entity/Piece';

// import MainScene from './scenes/MainScene';
// import Menu from './scenes/Menu';

class main extends Phaser.Scene {
  constructor() {
    super(game);
    this.scoreDiv = document.getElementById('statScore');
    this.linesDiv = document.getElementById('statLines');
    this.levelDiv = document.getElementById('statLevel');
    this.displayDiv = document.getElementById('display');
    this.game = game;
  }
  preload() {
    this.load.image('square', 'assets/sprites/square.png');
  }

  create() {
    this.pieceCount = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.over = false;
    //do l8r
    this.score = 0;
    this.scoreDiv.innerText = 'Score: 0';
    this.lines = 0;
    this.linesDiv.innerText = 'Lines: 0';
    this.level = 0;
    this.levelDiv.innerText = 'Level: 0';
    this.board = new Board(this.game, this);
    const piece = new Piece(this, Phaser.Math.RND.integerInRange(0, 6));
    this.add.existing(piece);
    this.board.pieces.push(piece);
    document.getElementById('newGame').onclick = function () {
      //this.scene.start('main');
    };
    document.getElementById('pause').onclick = function () {
      if (this.paused) {
        this.paused = false;
        this.innerText = 'Pause';
      } else {
        this.paused = true;
        this.innerText = 'Resume';
      }
    };
  }
}

class Game extends Phaser.Game {
  constructor() {
    super(config);
    // this.scene.add('Menu', Menu);
    // this.scene.add('MainScene', MainScene);
    this.scene.add('main', main);
    this.scene.start('main');
  }
}

const game = new Game(config);

//do l8r
