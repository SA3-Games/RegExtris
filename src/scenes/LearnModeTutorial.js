import 'phaser';

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

    this.add.text(600, 90, "press enter to start learn mode", {
      fontFamily: "retroFont",
      fontSize: 20,
      color: "#7a8bf4"
    }).setOrigin(0.5);
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.left)) {
      switch (this.stage) {
        case 2: {
          this.gameView.setTexture('LMT1');
          this.stage-=1;
          break;
        }
        case 3: {
          this.gameView.setTexture('LMT2');
          this.stage-=1;
          break;
        }
        default: {
          break;
        }
      }
        console.log(this.stage);
    }
    if (Phaser.Input.Keyboard.JustUp(this.right)) {
      switch (this.stage) {
        case 1: {
          this.gameView.setTexture('LMT2');
          this.stage+=1;
          break;
        }
        case 2: {
          this.gameView.setTexture('LMT3');
          this.stage+=1;
          break;
        }
        default: {
          break;
        }
      }
      console.log(this.stage);
    }
    if (this.enter.isDown) {
      this.scene.start('LearnMode');
    }
  }
}
