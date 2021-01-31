import 'phaser';
import config from '../config/config';

export default class Board {
  constructor(scene, gameMap) {
    this.cols = 10;
    this.rows = 20;
    this.gridSize = config.width / 10;
    this.scene = scene;
  }
  checkLines() {
    //returns object of all full rows
    //stored as key/value pairs (rowIndex: [characters for all blocks in row])
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
    this.scene.blocks.getChildren().forEach((square) => {
      if (square.loc === null) return;
      let x = square.loc[0] + 5;
      let y = square.loc[1];
      try {
        gameMap[y][x] = square.character;
      } catch (err) {
        //the piece has landed above the board
        this.scene.scene.pause();
        this.scene.over = true;
        console.log('GAME OVER!');
      }
    });
    // });
    const fullRows = {};
    gameMap.forEach(function (row, index) {
      if (!row.includes(0)) {
        fullRows[index] = row;
      }
    });
    console.dir(fullRows);
    return fullRows;
  }
  removeLine(index) {
    //takes out the line, shifts the higher squares down.
    this.scene.blocks.getChildren().forEach((square) => {
      if (square.loc === null) return;
      if (square.loc[1] === parseInt(index)) {
        square.loc = null;
        square.setActive(false);
        square.setVisible(false);
      } else if (square.loc[1] < index) {
        square.loc[1]++;
        square.y = square.loc[1] * this.scene.board.gridSize + 25;
      }
    });
  }
}
