import 'phaser';
import Block from './Block';

const pieceTypes = {
  0: {
    grid: [
      [-1, -1],
      [0, -1],
      [1, -1],
      [2, -1],
    ],
    color: 0x33ccff,
  },
  1: {
    grid: [
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ],
    color: 0x3333cc,
  },
  2: {
    grid: [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
    ],
    color: 0xff9900,
  },
  3: {
    grid: [
      [0, -1],
      [1, -1],
      [0, 0],
      [1, 0],
    ],
    color: 0xffff00,
  },
  4: {
    grid: [
      [0, -1],
      [1, -1],
      [0, 0],
      [-1, 0],
    ],
    color: 0x66ff33,
  },
  5: {
    grid: [
      [0, -1],
      [0, 0],
      [1, -1],
      [-1, -1],
    ],
    color: 0x9900ff,
  },

  6: {
    grid: [
      [0, -1],
      [-1, -1],
      [0, 0],
      [1, 0],
    ],
    color: 0xcc0000,
  },
};

export default class Piece extends Phaser.GameObjects.Group {
  constructor(scene, type) {
    super(scene, 0, 0);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.nextPiece = Phaser.Math.RND.integerInRange(0, 6);
    this.id = this.scene.pieceCount;
    this.scene.pieceCount++;
    this.grid = pieceTypes[type].grid;
    this.color = pieceTypes[type].color;
    this.grid.forEach((loc) => {
      const sprite = new Block(this.scene, 0, 0);
      sprite.setDisplaySize(45, 45);
      sprite.setTint(this.color);
      sprite.loc = loc;
      this.add(sprite);
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
    this.getChildren().forEach(function (square) {
      square.pending = [...square.loc];
      square.pending[1]++;
    });

    if (this.checkGround() && this.checkStack(0)) {
      this.yOffset++;
      this.applyPendingMove();
    } else {
      this.removePendingMove();
      const fullLines = this.scene.board.checkLines();
      let count = 0;
      let scores = [40, 60, 200, 900]; //points for each consecutive line
      Object.keys(fullLines).forEach((key) => {
        this.scene.score += scores[count] * (this.scene.level + 1);
        this.scene.lines++;
        if (this.scene.lines % 10 === 0) {
          this.scene.level++;
        }
        count++;
        this.scene.board.removeLine(key);
      });

      if (this.scene.over) return;
      this.scene.board.pieces.push(new Piece(this.scene, this.scene.nextPiece));
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
    let piece = this;
    this.scene.board.pieces.forEach(function (otherPiece) {
      if (piece.id === otherPiece.id) return;
      piece.getChildren().forEach(function (square) {
        otherPiece.getChildren().forEach(function (otherSquare) {
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
    });
    return offStack;
  }
  update() {
    this.move();
    this.keyCheck();
  }
}