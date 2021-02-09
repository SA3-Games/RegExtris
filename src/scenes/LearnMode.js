import BaseScene from './BaseScene';

export default class LearnMode extends BaseScene {
    constructor() {
      super();
    }

    create() {
        this.add.text(100, 100, `this is going to be a \nwonderful learn mode scene`, {
        fontFamily: "retroFont",
        fontSize: 30,
      })


        // this.assignLocations([450, 70], [850, 100]);
        // this.createGameBoard(...this.gameBoardLoc);
        // this.createRegexBoard(...this.regexBankLoc);
        // this.createBorders();
        // this.createTitle();
        // this.initializeGame();
    }
}