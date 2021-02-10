import BaseScene from './BaseScene';

export default class LearnMode extends BaseScene {
  constructor() {
    super();
    this.mode = 'learn';
  }

  create() {
    this.assignLocations([100, 70], [475, 100]);
    this.createGameBoard(...this.gameBoardLoc);
    this.createRegexBoard(...this.regexBankLoc);

    this.regexHintsBoard = this.add
      .rectangle(800, 105, 300, 570, this.foregroundColor)
      .setOrigin(0);
    this.regexHints = this.add.text(
      810,
      115,
      'RegEx is case sensitive\n\n[] = character class:\nmatches any enclosed character\nincludes single characters \nand/or ranges\n\nspecial characters, like * or $, \nare normal\nhyphens create ranges\nwhen between two single characters,\notherwise treated as normal\nranges are treated as entities\n\n[^] everything except the following\nnormal -> special character and vise versa\n\\d all digits\n\\w latin alphanumeric characters\n\\s whitespace\nCapitalizing special characters\nmeans exclude its matches'
    );

    this.createBorders([this.gameBoard, this.regexBoard, this.regexHintsBoard]);
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

/*
RegEx is case sensitive
[] = character class:
matches any enclosed character
includes single characters and/or ranges
special characters, like * or $, are normal
hyphens create ranges when between two single characters, otherwise treated as normal
ranges are treated as entities
[^] everything except the following

\ normal -> special character and vise versa
\d all digits
\w latin alphanumeric characters
\s whitespace
Capitalizing special characters means exclude these

*/
