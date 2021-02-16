import Phaser from 'phaser';
import store from '../store';
import { auth } from '../store/singlePlayer';
import { clearError } from '../store/errorStore';

export default class SignUpScene extends Phaser.Scene {
  constructor() {
    super('SignUpScene');
  }

  enterSubmit(e) {
    if ((e && e.keyCode == 13) || e == 0) {
      this.postSubmissionAction();
    }
  }

  enterMenu(e) {
    if ((e && e.keyCode == 13) || e == 0) {
      this.scene.start('LoadingScene');
    }
  }

  postSubmissionAction() {
    let inputAlias = document.getElementById('alias');
    let inputPassword = document.getElementById('password');
    let inputConfirmPassword = document.getElementById('confirm-password');
    //  check if fields are not empty
    if (inputAlias.value.length && inputPassword.value.length) {
      // check if password and confirm passwords match
      if (inputPassword.value === inputConfirmPassword.value) {
        this.errorDiv.innerHTML = '';
        store.dispatch(clearError());
        store.dispatch(auth(inputAlias.value, inputPassword.value, 'signup'));
      } else {
        this.errorDiv.innerHTML = 'password does not match';
      }
    }
  }

  preload() {
    this.load.html('signUpForm', 'assets/dom/signUpForm.html');
    this.load.image('title', 'assets/spritesheets/REGEXTRISbw2.png');
  }

  create() {
    this.unsubscribe = store.subscribe(() => {
      this.player = store.getState().player;
      this.error = store.getState().error;
      this.errorDiv.innerHTML = this.error.message;
      if (this.player.id && !this.error.message.length) {
        this.unsubscribe();
        this.scene.start('MenuScene');
      }
    });

    this.add.dom(600, 350).createFromCache('signUpForm');

    this.errorDiv = document.getElementById('error');

    //submit listeners:
    document.getElementById('submit-signup').addEventListener('keyup', (e) => {
      this.enterSubmit(e);
    });

    document.getElementById('submit-signup').addEventListener('click', () => {
      this.enterSubmit(0);
    });

    //menu listeners:
    document.getElementById('escape-signup').addEventListener('keyup', (e) => {
      this.enterMenu(e);
    });

    document.getElementById('escape-signup').addEventListener('click', () => {
      this.enterMenu(0);
    });

    this.title = this.add.sprite(600, 35, 'title').setScale(0.2).setDepth(11);

    this.add
      .text(600, 100, `use tab and shift-tab to navigate form`, {
        fontSize: '24px',
        fontFamily: 'retroFont',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);
  }
}
