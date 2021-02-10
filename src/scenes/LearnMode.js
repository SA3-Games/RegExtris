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
      808,
      110,
      "RegEx is case sensitive\nExpressions written btw /'s\n-----------------------------\n\n[]: Character Class\nMatches any enclosed character\n\nIncludes single characters \nand/or ranges\n\n-: Creates range if between\ntwo individual characters\n  x-z = xyz\n  5-9 = 56789\nOtherwise treated as normal\n  -xz = -xz\n  5-7-9 = 567-9\n\nSpecial characters(*, $, etc.)\nare treated as normal when\ninside a character class\n\n[^]: Everything except ...\n-----------------------------\n\n\\: Normal changed to special\ncharacter and vice versa\n  \\d: All digits\n  \\w: Latin alphanumeric\n  \\s: Whitespace\n\nCapitalized special character:\n  Exclude matches"
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
