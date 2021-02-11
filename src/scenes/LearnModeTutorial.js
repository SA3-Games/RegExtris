import 'phaser';

const tutorialText = [
  'Use right arrow key\n\nto progess the tutorial.\n\nUse left arrow key\n\nto view a previous step',
  'Over here we have Tetris! Use the arrow Keys to control:\nUP: rotate\nDOWN: fall faster\nRIGHT/LEFT: move sideways',
  'Each square has a character that represents its own single character string.',
  'When you get a full line in Tetris, the characters will be compared to your RegEx choice on the right.',
  'Your regex choice is made here and can be switched at any time with SHIFT.',
  'Learn Mode provides a helpful list of regex hints here',
  'In normal mode, you receive a Tetris score and a RegEx score, but Learn Mode is just for getting comfortable with the gameplay.',
  'Also, there are no levels, so fall speed never increases and a game over just restarts the game.',
  'When full lines are made, the lines are highlighted and Tetris pauses to give you time to finalize your RegEx choice.',
  'A 3-second timer will appear here. When it runs out, your choice is finalized and applied',
  'All blocks that match your RegEx choice will turn lilac before the lines disappear and Tetris resumes.',
  'The RegEx you used will be replaced with a different one, so choose wisely! Don’t waste a broad expression on a single line.',
  'Take as long as you need to familiarize yourself with the RegEx hints; they will be there for reference as you practice.',
];

export default class LearnModeTutorial extends Phaser.Scene {
  constructor() {
    super('LearnModeTutorial');
    this.stage = 1;
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
        fontSize: 20,
        color: '#7a8bf4',
      })
      .setOrigin(0.5);
    this.tutorialTextDisplay = this.add
      .text(150, 300, tutorialText[0], {
        fontFamily: 'retroFont',
        fontSize: 16,
        color: '#7a8bf4',
      })
      .setOrigin(0.5);
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.left)) {
      if (this.stage === 8) {
        this.gameView.setTexture('LMT1');
      }
      if (this.stage === 11) {
        this.gameView.setTexture('LMT2');
      }
      if (this.stage > 0) {
        this.tutorialTextDisplay.setText(tutorialText[this.stage]);
        this.stage -= 1;
      }
    }
    if (Phaser.Input.Keyboard.JustUp(this.right)) {
      if (this.stage === 7) {
        this.gameView.setTexture('LMT2');
      }
      if (this.stage === 10) {
        this.gameView.setTexture('LMT3');
      }
      if (this.stage < 13) {
        this.tutorialTextDisplay.setText(tutorialText[this.stage]);
        this.stage += 1;
      }
    }
    if (this.enter.isDown) {
      this.scene.start('LearnMode');
    }
  }
}
