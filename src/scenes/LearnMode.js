import BaseScene from './BaseScene';

export default class LearnMode extends BaseScene {
    constructor() {
      super();
      this.mode = "learn";
    }

    create() {
        this.assignLocations([100, 70], [475, 100]);
        this.createGameBoard(...this.gameBoardLoc);
        this.createRegexBoard(...this.regexBankLoc);
        
        this.regexLessonBoard = this.add.rectangle(800, 105, 300, 570, this.foregroundColor).setOrigin(0);
        
        this.createBorders([this.gameBoard, this.regexBoard, this.regexLessonBoard]);
        this.createTimer(600, 590);
        this.createTitle();
        this.initializeGame();
    }

    update() {
        this.checkRegexChoice();
        this.piece = this.pieces.getLast(true);
        this.piece.update();
    }
}