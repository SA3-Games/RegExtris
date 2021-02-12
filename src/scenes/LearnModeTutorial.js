import 'phaser';

const tutorialText = [
  'Use right arrow key\nto progess the tutorial.\nUse left arrow key\nto view a previous step',
  'Over here we have Tetris!\nUse the arrow Keys to control:\nUP: rotate\nDOWN: fall faster\nRIGHT/LEFT: move sideways',
  'Each square has a character\nthat represents its own\nsingle character string.',
  'When you get a full line,\nthe characters will be compared to\nyour RegEx choice nn the middle.',
  'Your regex choice is made here.\nYou can be switch at\nany time with SHIFT.',
  'Learn Mode provides a helpful\nlist of regex hints on the right!',
  'In normal mode, you receive\na Tetris score and a RegEx score,\nbut Learn Mode is just for getting\ncomfortable with the gameplay.',
  'Also, there are no levels,\nso fall speed never increases\nand a game over just restarts the game.',
  'When full lines are made,\nthe lines are highlighted and\nTetris pauses to give you time\nto finalize your RegEx choice.',
  'A 3-second timer will appear here.\nWhen it runs out,\nyour choice is finalized and applied',
  'All blocks that match your\nRegEx choice will turn lilac\nbefore the lines disappear\nand Tetris resumes.',
  'The RegEx you used will be\nreplaced with a different one,\nso choose wisely!\nDon’t waste a broad expression\non a single line.',
  'Take as long as you\nneed to familiarize yourself\nwith the RegEx hints;\nthey will be there for reference\nwhen you start Learn Mode.',
  'Press ENTER when you are\nready to start!',
];

export default class LearnModeTutorial extends Phaser.Scene {
  constructor() {
    super('LearnModeTutorial');
    this.stage = 1;
    this.tetrisPosition = [252, 500];
    this.regexPosition = [605, 170];
    this.timerPosition = [605, 500];
  }
  preload() {
    this.load.image('LMT1', 'assets/sprites/LearnModeTutorial1.png');
    this.load.image('LMT2', 'assets/sprites/LearnModeTutorial2.png');
    this.load.image('LMT3', 'assets/sprites/LearnModeTutorial3.png');
  }

  create() {
    this.enter = this.input.keyboard.addKey('ENTER');
    this.left = this.input.keyboard.addKey('LEFT');
    this.right = this.input.keyboard.addKey('RIGHT');

    //starting image
    this.gameView = this.add.image(600, 350, 'LMT1');

    this.add
      .text(600, 90, 'press enter to start learn mode', {
        fontFamily: 'retroFont',
        fontSize: 16,
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
      if (this.stage === 8) {
        this.gameView.setTexture('LMT2');
      }
      if (this.stage === 10) {
        this.gameView.setTexture('LMT3');
      }
      if (this.stage === 1 || this.stage === 6 || this.stage === 10) {
        this.tutorialTextDisplay.setPosition(...this.tetrisPosition);
      }
      if (this.stage === 4 || this.stage === 11) {
        this.tutorialTextDisplay.setPosition(...this.regexPosition);
      }
      if (this.stage === 9) {
        this.tutorialTextDisplay.setPosition(...this.timerPosition);
      }
      if (this.stage === 13) {
        this.tutorialTextDisplay.setPosition(600, 300);
      }
      if (this.stage < 14) {
        this.tutorialTextDisplay.setText(tutorialText[this.stage]);
        this.stage += 1;
      }
    }

    if (Phaser.Input.Keyboard.JustUp(this.left)) {
      if (this.stage === 9) {
        this.gameView.setTexture('LMT1');
      }
      if (this.stage === 11) {
        this.gameView.setTexture('LMT2');
      }
      if (this.stage === 10 || this.stage === 5 || this.stage === 12) {
        this.tutorialTextDisplay.setPosition(...this.tetrisPosition);
      }
      if (this.stage === 7 || this.stage === 14) {
        this.tutorialTextDisplay.setPosition(...this.regexPosition);
      }
      if (this.stage === 11) {
        this.tutorialTextDisplay.setPosition(...this.timerPosition);
      }
      if (this.stage === 2) {
        this.tutorialTextDisplay.setPosition(600, 350);
      }
      if (this.stage > 1) {
        this.tutorialTextDisplay.setText(tutorialText[this.stage - 2]);
        this.stage -= 1;
      }
    }
    if (Phaser.Input.Keyboard.JustUp(this.right)) {
      if (this.stage === 8) {
        this.gameView.setTexture('LMT2');
      }
      if (this.stage === 10) {
        this.gameView.setTexture('LMT3');
      }
      if (this.stage === 1 || this.stage === 6 || this.stage === 10) {
        this.tutorialTextDisplay.setPosition(...this.tetrisPosition);
      }
      if (this.stage === 4 || this.stage === 11) {
        this.tutorialTextDisplay.setPosition(...this.regexPosition);
      }
      if (this.stage === 9) {
        this.tutorialTextDisplay.setPosition(...this.timerPosition);
      }
      if (this.stage === 13) {
        this.tutorialTextDisplay.setPosition(600, 300);
      }
      if (this.stage < 14) {
        this.tutorialTextDisplay.setText(tutorialText[this.stage]);
        this.stage += 1;
      }
    }
    if (this.enter.isDown) {
      this.scene.start('LearnMode');
    }
  }
}
