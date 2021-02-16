import BaseScene from './BaseScene';

export default class LearnMode extends BaseScene {
  constructor() {
    super();
  }

  create() {
    this.mode = 'learn';
    this.enter = this.input.keyboard.addKey('ENTER');

    this.createMusic();
    this.assignLocations([100, 70], [475, 100]);
    this.createGameBoard(...this.gameBoardLoc);
    this.createRegexBoard(...this.regexBankLoc);

    this.regexHintsBoard = this.add
      .rectangle(800, 105, 300, 570, this.foregroundColor)
      .setOrigin(0);
    this.regexHints = this.add.text(
      808,
      115,
      "RegEx is case sensitive\nExpressions written btw /'s\n_____________________________ \n\n[]: Character Class\nMatches any enclosed character\n\nIncludes single characters \nand/or ranges\n\n-: Creates range if between\ntwo individual characters\n  x-z = xyz\n  5-9 = 56789\nOtherwise treated as normal\n  -xz = -xz\n  5-7-9 = 567-9\n\nSpecial characters(*, $, etc.)\nare treated as normal when\ninside a character class\n\n[^]: Everything except ...\n_____________________________ \n\n\\: Normal changed to special\ncharacter and vice versa\n  \\w: Latin alphanumeric\n  \\s: Whitespace\n  \\d: Digits\nCapitalizing inverts matches\n  \\D: Everything but digits"
    );

    this.createBorders([this.gameBoard, this.regexBoard, this.regexHintsBoard]);
    this.createTimer(600, 590);
    this.createTitle();
    this.add
      .text(600, 80, 'press esc to return to menu', {
        fontFamily: 'retroFont',
        fontSize: 20,
        color: '#7a8bf4',
      })
      .setOrigin(0.5)
      .setDepth(12);
    this.initializeGame();
  }

  update() {
    this.checkRegexChoice();
    this.piece = this.pieces.getLast(true);
    this.piece.update();
    this.returnToMenu();
  }
}
