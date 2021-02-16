import Phaser from 'phaser';
import store from '../store';
import { me } from '../store/singlePlayer';

export default class LoggedOutMenu extends Phaser.Scene {
  constructor() {
    super('LoggedOutMenu');
    this.selectedButtonIndex = 0;
    this.alias = '';
  }

  preload() {
    this.load.image('Neon-Box', 'assets/menuSprites/neonBlueBox.png');
    this.load.image('login', 'assets/menuSprites/login.png');
    this.load.image('signup', 'assets/menuSprites/signup.png');
    this.load.image('FAIRY', 'assets/menuSprites/FAIRY.png');
    this.load.image('title', 'assets/spritesheets/REGEXTRISbw2.png');
  }

  create() {
    this.selectedButtonIndex = 0;
    this.buttons = [];
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enter = this.input.keyboard.addKey('ENTER');

    store.dispatch(me());
    this.player = store.getState().player;

    // Log in button
    const logInButton = this.add.image(600, 200, 'login').setScale(0.2);

    // Sign Up button
    const signUpButton = this.add.image(600, 300, 'signup').setScale(0.2);
    // instructions
    this.add.text(400, 500, 'Use arrow keys to move\nUse enter key to select', {
      fontFamily: 'retroFont',
      fontSize: 25,
    });

    this.buttons.push(logInButton);
    this.buttons.push(signUpButton);

    logInButton.on('selected', () => {
      this.scene.start('LoginScene');
    });

    signUpButton.on('selected', () => {
      this.scene.start('SignUpScene');

      //each .on() should have a matching .off() to ensure that events are cleaned up.
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        logInButton.off('selected');
        signUpButton.off('selected');
      });
    });

    //sets the cursor
    this.buttonSelector = this.add.image(0, 0, 'FAIRY').setScale(0.2);

    this.selectButton(0);

    //title display
    this.title = this.add.sprite(600, 35, 'title').setScale(0.2).setDepth(11);
  }

  selectButton(index) {
    const currentButton = this.buttons[this.selectedButtonIndex];
    // set the current selected button to a white tint
    currentButton.setTint(0xffffff);
    const button = this.buttons[index];
    // set the newly selected button to a blue tint
    button.setTint(0x7a8bf4); //c3edf5
    // move the hand cursor to the right edge
    this.buttonSelector.x = button.x - button.displayWidth * 0.7;
    this.buttonSelector.y = button.y;
    // store the new selected index
    this.selectedButtonIndex = index;
  }

  selectNextButton(change = 1) {
    let index = this.selectedButtonIndex + change;
    // wrap the index to the front or end of array
    if (index >= this.buttons.length) {
      index = 0;
    } else if (index < 0) {
      index = this.buttons.length - 1;
    }
    this.selectButton(index);
  }

  confirmSelection() {
    // get the currently selected button
    const button = this.buttons[this.selectedButtonIndex];
    // emit the 'selected' event
    button.emit('selected');
  }

  update() {
    this.player = store.getState().player;
    if (this.player.alias) {
      this.scene.start('MenuScene', { player: this.player });
    }
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
    const enterJustPressed = Phaser.Input.Keyboard.JustDown(this.enter);
    if (upJustPressed) {
      this.selectNextButton(-1);
    } else if (downJustPressed) {
      this.selectNextButton(1);
    } else if (enterJustPressed) {
      this.confirmSelection();
    }
  }
}
