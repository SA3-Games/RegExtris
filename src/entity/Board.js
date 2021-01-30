import 'phaser';
import config from '../config/config';

export default class Board {
  constructor(game, scene) {
    this.cols = 10;
    this.rows = 20;
    this.gridSize = config.width / this.cols;
    console.log(this.gridSize);
    this.pieces = [];
    this.scene = scene;
  }
  checkLines() {
    //returns index of the first full row; none? returns -1
    let rows = this.rows;
    let cols = this.cols;
    let gameMap = [];
    //empty array of 0's
    for (var y = 0; y < rows; y++) {
      gameMap[y] = [];
      for (var x = 0; x < cols; x++) {
        gameMap[y][x] = 0;
      }
    }
    this.pieces.forEach((piece) => {
      piece.each((square) => {
        if (square.loc === null) return;
        let x = square.loc[0] + 5;
        let y = square.loc[1] - 1;
        try {
          gameMap[y][x] = 1;
        } catch (error) {
          //the piece has hit bottom above
          this.scene.over = true;
          this.scene.displayDiv.innerHTML = '<br>GAME OVER!';
        }
      });
    });
    let fullRow = '';
    for (var i = 0; i < cols; i++) fullRow += '1';
    let fullRowIndex = -1;
    gameMap.forEach(function (row, index) {
      if (row.join('') === fullRow) fullRowIndex = index;
    });
    return fullRowIndex;
  }
  removeLine(index) {
    //takes out the line, shifts the higher squares down.
    this.pieces.forEach(function (piece) {
      piece.each(function (square) {
        if (square.loc === null) return;
        if (square.loc[1] - 1 === index) {
          square.loc = null;
          square.visible = false;
        } else if (square.loc[1] - 1 < index) {
          square.loc[1]++;
        }
      });
      piece.move();
    });
  }
}
