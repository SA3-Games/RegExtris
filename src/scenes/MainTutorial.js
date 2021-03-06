import 'phaser';

const tutorialText = [
  'Use right arrow key\nto progess the tutorial.\nUse left arrow key\nto view a previous step.',
  'This is the Tetris board!\nBlocks will fall and\nyou will try to fit them\nall together to eliminate\nlines in classic Tetris style.',
  'Fall speed increases for\nevery 10 rows you destroy.',
  'Each square has a character\nthat represents its own\nsingle-character string.',
  'You can see the\nupcoming piece here!',
  'When you get a full line,\n the characters will be compared to\nyour RegEx choice on the right.',
  'Your regex choice is made here.\nYou can switch at\nany time with SHIFT.',
  'When full lines are made,\nthe lines are highlighted and\nTetris pauses to give you time\nto finalize your RegEx choice.',
  'A 3-second timer will appear here.\nWhen it runs out,\nyour choice is finalized and applied.',
  'All blocks that match your\nRegEx choice will turn lilac\nbefore the lines disappear\nand Tetris resumes.',
  'The RegEx you use will be\nreplaced with a different one.\nChoose wisely!',
  'Tetris score depends on \nhow many rows you destroy;\nRegEx score depends on\nhow many characters you match.',
  'At Game Over,\nyour scores will be\nanonymously ranked with\nall previous players’ scores.',
  'Press ENTER when you are\nready to start!',
];

export default class LearnModeTutorial extends Phaser.Scene {
  constructor() {
    super('MainTutorial');
  }
  preload() {
    this.load.image('MT1', 'assets/sprites/MainTutorial1.png');
    this.load.image('MT2', 'assets/sprites/MainTutorial2.png');
    this.load.image('MT3', 'assets/sprites/MainTutorial3.png');
    this.tetrisPosition = [600, 500];
    this.timerPosition = [975, 500];
    this.scorePosition = [225, 625];
    this.regexPosition = [975, 150];
    this.nextPiecePosition = [225, 325];
  }

  create() {
    this.stage = 1;
    this.enter = this.input.keyboard.addKey('ENTER');
    this.left = this.input.keyboard.addKey('LEFT');
    this.right = this.input.keyboard.addKey('RIGHT');

    //starting image
    this.gameView = this.add.image(600, 350, 'MT1').setDisplaySize(1000, 700);

    this.add
      .text(600, 80, 'press enter to start playing', {
        fontFamily: 'retroFont',
        fontSize: 20,
        color: '#7a8bf4',
      })
      .setOrigin(0.5);
    this.tutorialTextDisplay = this.add
      .text(600, 350, tutorialText[0], {
        fontFamily: 'retroFont',
        fontSize: 16,
        color: '#000000',
        backgroundColor: '#7a8bf4',
        align: 'center',
        stroke: '#7a8bf4',
        strokeThickness: 10,
      })
      .setOrigin(0.5);
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.right)) {
      if (this.stage === 7) {
        this.gameView.setTexture('MT2');
      }
      if (this.stage === 9) {
        this.gameView.setTexture('MT3');
      }
      if (
        this.stage === 1 ||
        this.stage === 5 ||
        this.stage === 7 ||
        this.stage === 9
      ) {
        this.tutorialTextDisplay.setPosition(...this.tetrisPosition);
      }
      if (this.stage === 6 || this.stage === 10) {
        this.tutorialTextDisplay.setPosition(...this.regexPosition);
      }
      if (this.stage === 8) {
        this.tutorialTextDisplay.setPosition(...this.timerPosition);
      }
      if (this.stage === 13) {
        this.tutorialTextDisplay.setPosition(600, 350);
      }
      if (this.stage === 11) {
        this.tutorialTextDisplay.setPosition(...this.scorePosition);
      }
      if (this.stage === 4) {
        this.tutorialTextDisplay.setPosition(...this.nextPiecePosition);
      }
      if (this.stage < 14) {
        this.tutorialTextDisplay.setText(tutorialText[this.stage]);
        this.stage += 1;
      }
    }
    if (Phaser.Input.Keyboard.JustUp(this.left)) {
      if (this.stage === 8) {
        this.gameView.setTexture('MT1');
      }
      if (this.stage === 10) {
        this.gameView.setTexture('MT2');
      }
      if (
        this.stage === 11 ||
        this.stage === 5 ||
        this.stage === 7 ||
        this.stage === 9
      ) {
        this.tutorialTextDisplay.setPosition(...this.tetrisPosition);
      }
      if (this.stage === 8 || this.stage === 12) {
        this.tutorialTextDisplay.setPosition(...this.regexPosition);
      }
      if (this.stage === 10) {
        this.tutorialTextDisplay.setPosition(...this.timerPosition);
      }
      if (this.stage === 2) {
        this.tutorialTextDisplay.setPosition(600, 350);
      }
      if (this.stage === 14) {
        this.tutorialTextDisplay.setPosition(...this.scorePosition);
      }
      if (this.stage === 6) {
        this.tutorialTextDisplay.setPosition(...this.nextPiecePosition);
      }
      if (this.stage > 1) {
        this.tutorialTextDisplay.setText(tutorialText[this.stage - 2]);
        this.stage -= 1;
      }
    }
    if (this.enter.isDown) {
      this.scene.start('MainScene');
    }
  }
}
