import 'phaser';

export default class Piece extends Phaser.GameObjects.Container {
  constructor(scene, type) {
    super(scene);
    this.scene = scene;
    this.scene.nextPiece = Phaser.Math.RND.integerInRange(0, 6);
    this.scene.displayDiv.innerHTML =
      "<img src='./assets/sprites/" +
      this.scene.nextPiece.toString() +
      ".png' class='nextPiece'>";
    this.id = this.scene.pieceCount;
    this.scene.pieceCount++;
    this.grid = null;
    switch (type) {
      case 0: //I
        this.grid = [
          [-1, 0],
          [0, 0],
          [1, 0],
          [2, 0],
        ];
        this.color = 0x33ccff;
        break;
      case 1: //J
        this.grid = [
          [-1, -1],
          [-1, 0],
          [0, 0],
          [1, 0],
        ];
        this.color = 0x3333cc;
        break;
      case 2: //L
        this.grid = [
          [-1, 0],
          [0, 0],
          [1, 0],
          [-1, 1],
        ];
        this.color = 0xff9900;
        break;
      case 3: //O
        this.grid = [
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ];
        this.color = 0xffff00;
        break;
      case 4: //S
        this.grid = [
          [0, 0],
          [1, 0],
          [0, 1],
          [-1, 1],
        ];
        this.color = 0x66ff33;
        break;
      case 5: //T
        this.grid = [
          [0, 0],
          [0, 1],
          [1, 0],
          [-1, 0],
        ];
        this.color = 0x9900ff;
        break;
      case 6: //Z
        this.grid = [
          [0, 0],
          [-1, 0],
          [0, 1],
          [1, 1],
        ];
        this.color = 0xcc0000;
        break;
    }
    this.grid.forEach((loc) => {
      const sprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'square');
      sprite.setSize(this.scene.board.gridSize * 0.9);
      sprite.setTint(this.color);
      sprite.loc = loc;
      this.add(sprite);
    });
    this.x = 5 * this.scene.board.gridSize; //shift to the middle
    console.log(this.x);
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
    this.each((square) => {
      if (square.loc === null) return;
      square.x = square.loc[0] * this.scene.board.gridSize;
      square.y = square.loc[1] * this.scene.board.gridSize;
    });
  }
  applyPendingMove() {
    this.each(function (square) {
      square.loc = square.pending.slice();
    });
  }
  removePendingMove() {
    this.each(function (square) {
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
    this.each(function (square) {
      square.pending = square.loc.slice();
      square.pending[1]++;
    });

    if (this.checkGround() && this.checkStack(0)) {
      this.yOffset++;
      this.applyPendingMove();
    } else {
      this.removePendingMove();
      this.update = function () {};
      let fullLine = this.scene.board.checkLines();
      let count = 0;
      let scores = [40, 60, 200, 900]; //points for each consecutive line
      while (fullLine > -1 && count < 4) {
        this.scene.score += scores[count] * (this.scene.level + 1);
        this.scene.lines++;
        if (this.scene.lines % 10 === 0) {
          this.scene.level++;
          this.scene.levelDiv.innerText =
            'Level: ' + this.scene.level.toString();
        }
        this.scene.scoreDiv.innerText = 'Score: ' + this.scene.score.toString();
        this.scene.linesDiv.innerText = 'Lines: ' + this.scene.lines.toString();
        count++;
        this.scene.board.removeLine(fullLine);
        fullLine = this.scene.board.checkLines();
      }

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

    let piece = this;
    piece.each(function (square) {
      square.pending = rotate(
        square.loc[0],
        square.loc[1],
        piece.xOffset,
        piece.yOffset,
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
      this.scene.time.events.add(
        1000 / 6,
        function () {
          piece.rotateTimeout = false;
        },
        this
      );
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
    this.each(function (square) {
      square.pending = square.loc.slice();
      square.pending[0] += dir;
    });

    if (this.checkWall(dir, 1) && this.checkStack(dir)) {
      this.strafeTimeout = true;
      this.xOffset += dir;
      this.applyPendingMove();
      let piece = this;
      this.scene.time.events.add(
        1000 / 8,
        function () {
          piece.strafeTimeout = false;
        },
        this
      );
    } else this.removePendingMove();
  }
  checkGround() {
    let offGround = true;
    this.each((square) => {
      //USE PENDING?
      if (square.pending[1] === this.scene.board.rows) offGround = false;
    });
    return offGround;
  }
  checkWall(side) {
    //side => -1: left 1:right
    //offset allows us to check ahead (1) or check current (0)
    let offWall = true;
    let piece = this;
    this.eachach(function (square) {
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
      piece.each(function (square) {
        otherPiece.each(function (otherSquare) {
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
