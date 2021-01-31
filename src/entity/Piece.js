import 'phaser';
import Block from './Block';

const pieceTypes = {
  I: {
    grid: [
      [-2, -1],
      [-1, -1],
      [0, -1],
      [1, -1],
    ],
    color: 0x33ccff,
    possibleNext: ['J', 'L', 'O', 'S', 'T', 'Z'],
  },
  J: {
    grid: [
      [1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ],
    color: 0x3333cc,
    possibleNext: ['I', 'L', 'O', 'S', 'T', 'Z'],
  },
  L: {
    grid: [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
    ],
    color: 0xff9900,
    possibleNext: ['J', 'I', 'O', 'S', 'T', 'Z'],
  },
  O: {
    grid: [
      [0, -1],
      [1, -1],
      [0, 0],
      [1, 0],
    ],
    color: 0xffff00,
    possibleNext: ['J', 'L', 'I', 'S', 'T', 'Z'],
  },
  S: {
    grid: [
      [0, -1],
      [1, -1],
      [0, 0],
      [-1, 0],
    ],
    color: 0x66ff33,
    possibleNext: ['J', 'L', 'O', 'I', 'T', 'Z'],
  },
  T: {
    grid: [
      [0, -1],
      [0, 0],
      [1, -1],
      [-1, -1],
    ],
    color: 0x9900ff,
    possibleNext: ['J', 'L', 'O', 'S', 'I', 'Z'],
  },

  Z: {
    grid: [
      [0, -1],
      [-1, -1],
      [0, 0],
      [1, 0],
    ],
    color: 0xcc0000,
    possibleNext: ['J', 'L', 'O', 'S', 'T', 'I'],
  },
};

export default class Piece extends Phaser.GameObjects.Group {
  constructor(scene, type) {
    super(scene, 0, 0);

    this.scene = scene;
    this.scene.add.existing(this);
    const { grid, color, possibleNext } = pieceTypes[type];
    this.scene.nextPiece = Phaser.Math.RND.pick(possibleNext);
    this.grid = grid;
    this.color = color;
    this.id = this.scene.pieceCount;
    this.scene.pieceCount++;
    this.grid.forEach((loc) => {
      const deadSprite = this.scene.blocks.getFirstDead();
      if (deadSprite) {
        this.scene.blocks.remove(deadSprite);
      }
      const sprite = deadSprite
        ? deadSprite.reset()
        : new Block(this.scene, 0, 0);
      sprite.setDisplaySize(45, 45);
      sprite.setTint(this.color);
      sprite.loc = loc;
      this.add(sprite);
      this.scene.pieces.add(this);
    });
    this.x = 5 * this.scene.board.gridSize; //shift to the middle
    this.yOffset = 0;
    this.xOffset = 0;
    this.fallDelay = 1000 / 4; //must be set initially
    this.scene.time.addEvent({
      delay: this.fallDelay,
      callback: this.shift,
      callbackScope: this,
    });
  }
  move() {
    this.getChildren().forEach((square) => {
      if (square.loc === null) return;
      square.x = square.loc[0] * this.scene.board.gridSize + 275;
      square.y = square.loc[1] * this.scene.board.gridSize + 25;
    });
  }
  applyPendingMove() {
    this.getChildren().forEach(function (square) {
      square.loc = [...square.pending];
    });
  }
  removePendingMove() {
    this.getChildren().forEach(function (square) {
      square.pending = null;
    });
  }

  keyCheck() {
    //333MS - this.scene.level * 10; Max level = 33;
    this.fallDelay = 1000 / 3 - this.scene.level * 10;
    if (this.scene.cursors.up.isDown) {
      this.rotate();
    } else if (this.scene.cursors.down.isDown) {
      this.fallDelay = 1000 / 20;
    }
    if (this.scene.cursors.left.isDown) {
      this.strafe(-1);
    } else if (this.scene.cursors.right.isDown) {
      this.strafe(1);
    }
  }
  shift() {
    this.getChildren().forEach((square) => {
      square.pending = [...square.loc];
      square.pending[1]++;
    });

    if (this.checkGround() && this.checkStack(0)) {
      this.yOffset++;
      this.applyPendingMove();
    } else {
      this.removePendingMove();
      this.scene.blocks.addMultiple(this.getChildren());
      const fullRows = this.scene.board.checkLines();
      let count = 0;
      let scores = [40, 60, 200, 900]; //points for each consecutive line
      const numFullRows = Object.keys(fullRows).length;
      if (numFullRows) {
        if (numFullRows === 4) {
          console.log('TETRIS');
        }
        Object.keys(fullRows).forEach((key) => {
          this.scene.score += scores[count] * (this.scene.level + 1);
          this.scene.lines++;
          if (this.scene.lines % 10 === 0) {
            this.scene.level++;
          }
          count++;
          this.scene.board.removeLine(key);
        });
      }

      if (this.scene.over) return;
      this.scene.pieces.add(new Piece(this.scene, this.scene.nextPiece));
      this.destroy();
      return;
    }
    this.scene.time.addEvent({
      delay: this.fallDelay,
      callback: this.shift,
      callbackScope: this,
    });
  }
  rotate() {
    if (this.rotateTimeout) return;
    this.getChildren().forEach((square) => {
      square.pending = rotate(
        square.loc[0],
        square.loc[1],
        this.xOffset,
        this.yOffset,
        Math.PI / 2
      );
    });
    if (
      this.checkWall(1) &&
      this.checkWall(-1) &&
      this.checkStack(0) &&
      this.checkGround()
    ) {
      this.rotateTimeout = true;
      this.applyPendingMove();
      this.scene.time.addEvent({
        delay: 1000 / 6,
        callback: function () {
          this.rotateTimeout = false;
        },
        callbackScope: this,
      });
    } else this.removePendingMove();

    function rotate(oldX, oldY, centerX, centerY, angle) {
      oldX -= centerX;
      oldY -= centerY;
      let newX = oldX * Math.cos(angle) - oldY * Math.sin(angle);
      let newY = oldY * Math.cos(angle) + oldX * Math.sin(angle);
      newX += centerX;
      newY += centerY;
      newX = Math.round(newX);
      newY = Math.round(newY);
      return [newX, newY];
    }
  }
  strafe(dir) {
    if (this.strafeTimeout) return;
    this.getChildren().forEach(function (square) {
      square.pending = [...square.loc];
      square.pending[0] += dir;
    });

    if (this.checkWall(dir, 1) && this.checkStack(dir)) {
      this.strafeTimeout = true;
      this.xOffset += dir;
      this.applyPendingMove();
      let piece = this;
      this.scene.time.addEvent({
        delay: 1000 / 8,
        callback: function () {
          piece.strafeTimeout = false;
        },
        callbackScope: this,
      });
    } else this.removePendingMove();
  }
  checkGround() {
    let offGround = true;
    this.getChildren().forEach((square) => {
      //USE PENDING?
      if (square.pending[1] === this.scene.board.rows) offGround = false;
    });
    return offGround;
  }
  checkWall(side) {
    //side => -1: left 1:right
    //offset allows us to check ahead (1) or check current (0)
    let offWall = true;
    this.getChildren().forEach(function (square) {
      if (side === -1) {
        if (square.pending[0] === -6) offWall = false;
      } else {
        if (square.pending[0] === 5) offWall = false;
      }
    });
    return offWall;
  }
  checkStack(dir) {
    //dir => -1:left 1:right 0:down
    let offStack = true;
    this.getChildren().forEach((square) => {
      this.scene.blocks.getChildren().forEach((otherSquare) => {
        if (square.loc === null || otherSquare.loc === null) return;
        let checks =
          square.pending[0] === otherSquare.loc[0] &&
          square.pending[1] === otherSquare.loc[1];
        if (dir === 1) {
          checks =
            square.pending[0] === otherSquare.loc[0] &&
            square.pending[1] === otherSquare.loc[1];
        }
        if (dir === -1) {
          checks =
            square.pending[0] === otherSquare.loc[0] &&
            square.pending[1] === otherSquare.loc[1];
        }
        if (checks) {
          offStack = false;
        }
      });
    });
    return offStack;
  }
  update() {
    this.move();
    this.keyCheck();
  }
}
