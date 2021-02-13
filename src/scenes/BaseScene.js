import "phaser";


import Board from "../entity/Board";
import Piece from "../entity/Piece";
import Square from "../entity/Square";
import RegexOption from "../entity/RegexOption";
import store from "../store";
import { clearPlayerData } from "../store/playerRegex";


export default class BaseScene extends Phaser.Scene {
  constructor(name) {
    super(name);
  }
  preload() {
    this.load.audio("heckincrows", "assets/audio/heckincrows.ogg");
    this.load.audio("timer", "assets/audio/timer.wav");
    this.load.audio("row", "assets/audio/rowDestroy.wav");

    this.load.spritesheet("square", "assets/spritesheets/WHITEtetrominos.png", {
      frameWidth: 28,
      frameHeight: 28,
    });
    this.load.spritesheet("timer", "assets/spritesheets/timer.png", {
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.image("fairy", "assets/menuSprites/FAIRY.png");
    this.load.image("title", "assets/spritesheets/REGEXTRISbw2.png");
    this.load.image("I", "assets/sprites/0.png");
    this.load.image("J", "assets/sprites/1.png");
    this.load.image("L", "assets/sprites/2.png");
    this.load.image("O", "assets/sprites/3.png");
    this.load.image("S", "assets/sprites/4.png");
    this.load.image("T", "assets/sprites/5.png");
    this.load.image("Z", "assets/sprites/6.png");
  }

  assignLocations(tetrisLoc, regexLoc) {
    //used in multiple files
    this.gameBoardLoc = tetrisLoc;
    this.regexBankLoc = regexLoc;
  }

  createGameBoard(x, y) {
    this.gameBoard = this.add
      .rectangle(x - 5, y, 310, 605, this.foregroundColor)
      .setOrigin(0);

    this.gameBoardHeader = this.add
      .rectangle(x - 10, 0, 320, 105, 0x000000)
      .setOrigin(0)
      .setDepth(10);

    //line for top of tetris board
    this.add
      .rectangle(x - 7, y + 31, 314, 4, 0xffffff)
      .setOrigin(0)
      .setDepth(11);
  }

  createRegexBoard(x, y) {
    this.regexBoard = this.add
      .rectangle(x, y + 5, 250, 570, this.foregroundColor)
      .setOrigin(0);

    this.regexLabel = this.add
      .text(x + 125, y + 30, "Regex Choice", {
        fontFamily: "retroFont",
        fontSize: "20px",
      })
      .setOrigin(0.5);
    this.regexControlsDisplay = this.add
      .text(x + 125, y + 65, "Press SHIFT to move\nfairy between options", {
        fontFamily: "retroFont",
        fontSize: "14px",
        align: "center",
      })
      .setOrigin(0.5);
    this.regexOptions = this.physics.add.group({ classType: RegexOption });
    for (let i = 0; i < 5; i++) {
      this.regexOptions.add(new RegexOption(this, x + 70, y + 140 + 60 * i, i));
    }
    this.regexChoice = this.regexOptions.getChildren()[0];
    this.regexChoice.setTint(0x7a8bf4);
    this.regexFairy = this.physics.add
      .sprite(x + 10, y + 140, "fairy")
      .setDisplaySize(55, 55)
      .setOrigin(0, 0.2);
  }

  createScoreBoard() {
    this.scoreBoard = this.add
      .rectangle(100, 370, 250, 305, this.foregroundColor)
      .setOrigin(0);

    this.scoreDisplay = this.add
      .text(
        225,
        380,
        `Tetris Score:\n\n${this.score}\n\n\nRegEx Score:\n\n${this.regexScore}`,
        { fontFamily: "retroFont", fontSize: "20px", align: "center" }
      )
      .setOrigin(0.5, 0);
    this.tetrisControlsDisplay = this.add.text(
      120,
      560,
      "UP = rotate\n\nDOWN = fall faster\n\nRIGHT = move right\n\nLEFT = move left",
      { fontFamily: "retroFont", fontSize: "14px" }
    );
  }

  createNextPieceBoard() {
    this.nextPieceBoard = this.add
      .rectangle(100, 105, 250, 250, this.foregroundColor)
      .setOrigin(0);
    this.nextPieceText = this.add
      .text(225, 130, "Up Next:", { fontFamily: "retroFont", fontSize: "20px" })
      .setOrigin();
    this.nextPieceDisplay = this.add.image(225, 235, "I");
  }

  createBorders(boards) {
    //container border
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(4, 0xffffff, 1);
    boards.forEach((board) => {
      this.graphics.strokeRectShape(board);
    });
  }

  createTimer(x, y, fps = 1) {
    this.timer = this.physics.add
      .sprite(x, y, "timer", 10)
      .setDisplaySize(75, 75)
      .setVisible(false);

    this.anims.create({
      key: "countDown",
      frames: this.anims.generateFrameNumbers("timer", { start: 2, end: 0 }),
      frameRate: fps,
      repeat: 0,
    });
  }

  createMusic() {
    this.song = this.sound.add("heckincrows", {volume: 0.2}).setLoop(true);
    this.song.play();
  }

  createTitle() {
    this.title = this.add.sprite(600, 35, "title").setScale(0.2).setDepth(11);
  }

  initializeGame() {
    this.foregroundColor = 0x000000;
    this.pieceCount = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.shift = this.input.keyboard.addKey("SHIFT");
    this.cursors.esc = this.input.keyboard.addKey("ESC");
    this.gameOver = false;
    this.regexScore = 0;
    this.score = 0;
    this.destroyedRows = 0;
    this.level = 0;
    this.regexLocked = false;
    //groups for pieces
    this.pieces = this.physics.add.group({ classType: Piece });
    //group for landed squares
    this.squares = this.physics.add.group({ classType: Square });
    //methods and data for game board grid
    this.board = new Board(this);
    //create first piece
    this.pieces.add(
      new Piece(this, Phaser.Math.RND.pick(["I", "J", "L", "O", "S", "T", "Z"]))
    );
  }

  returnToMenu() {
    if (this.cursors.esc.isDown) {
      if ((this.mode = "normal")) {
        store.dispatch(clearPlayerData());
      }
      this.song.stop();
      this.scene.start("MenuScene");
    }
  }

  checkRegexChoice() {
    if (Phaser.Input.Keyboard.JustUp(this.cursors.shift)) {
      if (!this.regexLocked) {
        if (this.regexFairy.y === this.regexBankLoc[1] + 380) {
          this.regexFairy.y = this.regexBankLoc[1] + 140;
        } else {
          this.regexFairy.y += 60;
        }
        this.regexOptions.setTint(0xffffff);
        const currentRegex = this.regexOptions
          .getChildren()
          .filter((option) => option.y === this.regexFairy.y);
        this.regexChoice = currentRegex[0];
        this.regexChoice.setTint(0x7a8bf4);
      }
    }
  }
}
