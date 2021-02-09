import 'phaser';
import Square from './Square';

const pieceTypes = {
  //name of piece
  I: {
    //square starting locations on game board grid
    grid: [
      [-2, -1],
      [-1, -1],
      [0, -1],
      [1, -1],
    ],
    //tint for all squares
    color: 0x33ccff,
    //all other piece types for random selection
    possibleNext: ['J', 'L', 'O', 'S', 'T', 'Z'],
  },
  J: {
    grid: [
      [1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ],
    color: 0x3333ff,
    possibleNext: ['I', 'L', 'O', 'S', 'T', 'Z'],
  },
  L: {
    grid: [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
    ],
    color: 0xff6600,
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
    color: 0xff0000,
    possibleNext: ['J', 'L', 'O', 'S', 'T', 'I'],
  },
};

export default class Piece extends Phaser.GameObjects.Group {
  constructor(scene, type) {
    super(scene, 0, 0);

    this.scene = scene;
    this.scene.add.existing(this);
    //get all info for piece type
    const { grid, color, possibleNext } = pieceTypes[type];
    //randomly choose next piece
    this.scene.nextPiece = Phaser.Math.RND.pick(possibleNext);
    //skips nextPieceDisplay in Learn Mode:
    if (this.mode === "normal") {
      this.scene.nextPieceDisplay.setTexture(this.scene.nextPiece);
    }
    this.grid = grid;
    this.color = color;
    this.id = this.scene.pieceCount;
    this.scene.pieceCount++;
    //create piece's squares with the grid locations
    this.grid.forEach((loc) => {
      //look for inactive square sprites to reuse
      const deadSquare = this.scene.squares.getFirstDead();
      if (deadSquare) {
        this.scene.squares.remove(deadSquare);
      }
      //either reset/reuse square or create a new one
      const square = deadSquare
        ? deadSquare.reset()
        : new Square(this.scene, 600, 0);
      square.setTint(this.color);
      square.loc = loc;
      //add square to this group
      this.add(square);
    });
    //add this group to the scene's pieces group
    this.scene.pieces.add(this);
    this.yOffset = 0;
    this.xOffset = 0;
    this.fallDelay = 1000 / 4;
    //set timeout for peices first fall
    this.scene.time.addEvent({
      delay: this.fallDelay,
      callback: this.fallDown,
      callbackScope: this,
    });
  }

  //helper functions for all piece movement methods
  applyPendingMove() {
    this.getChildren().forEach(function (square) {
      square.loc = [...square.pending];
    });
    this.move();
  }

  //apply new square location to each square's x/y coordinates
  move() {
    this.getChildren().forEach((square) => {
      if (square.loc === null) return;
      square.x =
        square.loc[0] * this.scene.board.gridSize + //location -> pixel coordinates
        this.scene.board.gridSize * 5.5 + //centers piece
        this.scene.gameBoardLoc[0]; //keeps pieces on board
      square.y =
        square.loc[1] * this.scene.board.gridSize +
        this.scene.board.gridSize / 2 + //aligns pieces with ground and walls
        this.scene.gameBoardLoc[1];
    });
  }

  //when a pending move is impossible, remove it
  removePendingMove() {
    this.getChildren().forEach(function (square) {
      square.pending = null;
    });
  }

  //check if pending move overlaps ground
  checkGround() {
    let offGround = true;
    this.getChildren().forEach((square) => {
      if (square.pending[1] === this.scene.board.rows) offGround = false;
    });
    return offGround;
  }

  //check if pending move overlaps either wall
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

  //check if pending move will overlap other stacked pieces
  checkStack(dir) {
    //dir => -1:left 1:right 0:down
    let offStack = true;
    //compare pending move of all piece squares to location of all landed squares in scene
    this.getChildren().forEach((square) => {
      this.scene.squares.getChildren().forEach((otherSquare) => {
        if (square.loc === null || otherSquare.loc === null) return; //ignore inactive squares
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
  //end of helper functions

  //piece falls down one grid square, if the square is not taken
  fallDown() {
    this.getChildren().forEach((square) => {
      //increment each squares y location and make a pending move
      square.pending = [...square.loc];
      square.pending[1]++;
    });

    //if the pending move doesn't overlap the stack or the ground
    if (this.checkGround() && this.checkStack(0)) {
      //apply the move
      this.yOffset++;
      this.applyPendingMove();
      //set timeout for pieces next fall with the current fall delay
      this.scene.time.addEvent({
        delay: this.fallDelay,
        callback: this.fallDown,
        callbackScope: this,
      });
    } else {
      //if move would overlap stack or ground, cancel it (the peice has already 'landed')
      this.removePendingMove();
      //put all squares into the scene's squares group
      this.scene.squares.addMultiple(this.getChildren());
      //get full rows
      const fullRows = this.scene.board.checkRows();
      const scores = [40, 60, 200, 900];
      //this.tetris = false
      //this.regex = true
      const numFullRows = Object.keys(fullRows).length;
      if (numFullRows) {
        //if there are full rows, set timeout to delay line destruction
        //**plug-in RegEx gameplay HERE**
        this.scene.timer.setVisible(true);
        this.scene.timer.anims.play('countDown');
        this.scene.time.addEvent({
          delay: 3000,
          callback: function () {
            for (let i = 0; i < numFullRows; i++) {
              const rowIndex = Object.keys(fullRows)[i];
              const regexTotal = this.board.checkRegEx(
                rowIndex,
                this.regexChoice.re
              );
              this.regexScore += regexTotal * 10;
              this.timer.setVisible(false);
            }
          },
          callbackScope: this.scene,
        });
        this.scene.time.addEvent({
          delay: 4000,
          //scope for callback is MainScene **Careful with changes**
          callback: function () {
            if (numFullRows === 4) {
              //replace with Tetris SFX in scene
              console.log('TETRIS');
            }
            //remove all full lines
            for (let i = 0; i < numFullRows; i++) {
              const rowIndex = Object.keys(fullRows)[i];
              this.board.removeRow(rowIndex);
            }
            //increase score and game level accordingly
            this.score += scores[numFullRows - 1] * (this.level + 1);
            this.destroyedRows += numFullRows;
            if (this.destroyedRows % 10 === 0) {
              this.level++;
            }
            this.regexChoice.changeRegex();
            //destroy this piece group and create the next one
            this.pieces.getLast(true).destroy();
            this.pieces.add(new Piece(this, this.nextPiece));
            return;
          },
          callbackScope: this.scene,
        });
      } else {
        //if there are no full rows and game has not ended
        if (this.scene.gameOver) return;
        //create a new piece and then destroy this one **scope is this peice**
        this.scene.pieces.add(new Piece(this.scene, this.scene.nextPiece));
        this.destroy();
        return;
      }
    }
  }

  //rotate piece clockwise
  rotate() {
    if (this.rotateTimeout) return; //keeps piece from rotating multiple times for same button push
    this.getChildren().forEach((square) => {
      //create pending move for rotation
      square.pending = getRotationCoords(
        square.loc[0],
        square.loc[1],
        this.xOffset,
        this.yOffset,
        Math.PI / 2
      );
    });
    //if pending move does not overlap walls, ground, or stack
    if (
      this.checkWall(1) &&
      this.checkWall(-1) &&
      this.checkStack(0) &&
      this.checkGround()
    ) {
      //stop piece from rotating for 1000/6 ms
      this.rotateTimeout = true;
      this.scene.time.addEvent({
        delay: 1000 / 6,
        callback: function () {
          this.rotateTimeout = false;
        },
        callbackScope: this,
      });
      //and apply the move
      this.applyPendingMove();
    } else {
      //if pending move is not possible, cancel it
      this.removePendingMove();
    }

    //helper function for finding square locations for rotation
    function getRotationCoords(oldX, oldY, centerX, centerY, angle) {
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

  //move piece right or left
  strafe(dir) {
    //dir -> 1: right, -1: left
    if (this.strafeTimeout) return; //keeps strafe from happening again immediately for same button push
    this.getChildren().forEach(function (square) {
      square.pending = [...square.loc];
      square.pending[0] += dir;
    });
    //if pending move does not overlap wall or stack
    if (this.checkWall(dir, 1) && this.checkStack(dir)) {
      //stop piece from strafing for 1000/8 ms
      this.strafeTimeout = true;
      this.scene.time.addEvent({
        delay: 1000 / 8,
        callback: () => {
          this.strafeTimeout = false;
        },
        callbackScope: this,
      });
      //change x offset and strafe the piece
      this.xOffset += dir;
      this.applyPendingMove();
    } else {
      //if move is not possible, cancel it
      this.removePendingMove();
    }
  }

  //check for arrow key presses
  keyCheck() {
    //333MS - this.scene.level * 10; Max level = 33;
    this.fallDelay = 1000 / 3 - this.scene.level * 10;
    if (this.scene.cursors.up.isDown) {
      this.rotate(); //rotate clockwise
    } else if (this.scene.cursors.down.isDown) {
      this.fallDelay = 1000 / 20; //increase fall speed
    }
    if (this.scene.cursors.left.isDown) {
      this.strafe(-1); //move left
    } else if (this.scene.cursors.right.isDown) {
      this.strafe(1); //move right
    }
  }

  update() {
    //apply any new square coordinates
    //this.move(); **Moved to applyPendingMove method**
    //check for user inputs
    this.keyCheck();
  }
}
