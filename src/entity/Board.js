import 'phaser';
import config from '../config/config';
import store from '../store';
import { addRegexChoice } from '../store/playerRegex';

export default class Board {
  constructor(scene) {
    this.cols = 10;
    this.rows = 20;
    this.gridSize = 30; //size of each grid space
    this.scene = scene;
  }

  //look for full rows
  checkRows() {
    let rows = this.rows;
    let cols = this.cols;
    let gameMap = [];
    //create new 20x10 matrix of 0's to reprisent board grid
    for (var y = 0; y < rows; y++) {
      gameMap[y] = [];
      for (var x = 0; x < cols; x++) {
        gameMap[y][x] = 0;
      }
    }
    //put each square in the matrix
    this.scene.squares.getChildren().forEach((square) => {
      if (square.loc === null) return; //ignore inactive squares
      let x = square.loc[0] + 5; //all x locations relative to center of grid (index 5)
      let y = square.loc[1];
      try {
        //try to store squares attached character in matrix at location
        gameMap[y][x] = square.character;
      } catch (err) {
        //if an error happens, the row does not exist in the matrix
        //the piece has landed above the board
        this.scene.gameOver = true;
        this.scene.scene.start('GameOverScene', { score: this.scene.score });
      }
    });

    //returns object of all full rows
    const fullRows = {};
    gameMap.forEach(function (row, index) {
      //full rows will have no 0's left
      if (!row.includes(0)) {
        //store full rows by there index, with array of attached characters as value
        fullRows[index] = row;
      }
    });
    return fullRows;
  }

  //recieve index for full row and destroys it
  checkRegEx(index, re) {
    let total = 0;
    this.scene.squares.getChildren().forEach((square) => {
      if (square.loc === null) return;
      if (square.loc[1] === parseInt(index)) {
        const result = square.character.match(re);
        if (result) {
          square.setTint(0xffffff);
          total += 1;
        }
      }
    });
    store.dispatch(addRegexChoice(re, total));
    return total;
  }

  removeRow(index) {
    //check all landed squares
    this.scene.squares.getChildren().forEach((square) => {
      if (square.loc === null) return; //ignore inactive squares
      if (square.loc[1] === parseInt(index)) {
        //if square is in the full row, set to inactive and delete location
        square.loc = null;
        square.setActive(false);
        square.setVisible(false);
      } else if (square.loc[1] < index) {
        //move all rows above destroyed row down by 1 grid space
        square.loc[1]++;
        square.y =
          square.loc[1] * this.scene.board.gridSize + //location -> pixel coordinates
          this.scene.board.gridSize / 2 + //align with walls and ground
          this.scene.gameBoardLoc[1]; //keep square on board
      }
    });
  }
}
