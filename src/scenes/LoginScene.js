import store from "../store";
import { auth } from "../store/singlePlayer";

export default class LoginScene extends Phaser.Scene {
  constructor() {
    super("LoginScene");
    this.player;
    this.error = {};
  }

  enterSubmit(e) {
    if ((e && e.keyCode == 13) || e == 0) {
      this.postSubmissionAction();
    }
  }

  enterMenu(e) {
    if ((e && e.keyCode == 13) || e == 0) {
      this.scene.start("LoadingScene");
    }
  }

  postSubmissionAction() {
      let inputAlias = document.getElementById("alias");
      let inputPassword = document.getElementById("password");
      //  check if fields are not empty
      if (inputAlias.value.length && inputPassword.value.length) {
        // check if password and confirm passwords match
        this.errorDiv.innerHTML = "";
        store.dispatch(auth(inputAlias.value, inputPassword.value, "login"));
      }
  }

  init() {}
  preload() {
    this.load.html("loginForm", "assets/dom/loginForm.html");
    this.load.image("title", "assets/spritesheets/REGEXTRISbw2.png");
  }
  create() {
    this.unsubscribe = store.subscribe(() => {
      this.player = store.getState().player;
      this.error = store.getState().error;
      this.errorDiv.innerHTML = this.error.message;
      if (this.player.id && !this.error.message.length) {
        this.unsubscribe();
        this.scene.start("MenuScene");
      }
    });

    this.add.dom(600, 350).createFromCache("loginForm");

    this.loginForm = document.getElementById("log-in");
    this.errorDiv = document.getElementById("error");

    //submit listeners:
    document.getElementById("submit-login").addEventListener("keyup", (e) => {
      this.enterSubmit(e);
    });

    document.getElementById("submit-login").addEventListener("click", () => {
      this.enterSubmit(0);
    });

    //menu listeners:
    document.getElementById("escape-login").addEventListener("keyup", (e) => {
      this.enterMenu(e);
    });

    document.getElementById("escape-login").addEventListener("click", () => {
      this.enterMenu(0);
    });

    // this.loginForm.onsubmit = (event) => {
    //   event.preventDefault();
    //   this.postSubmissionAction();
    // };

    //title display
    this.title = this.add.sprite(600, 35, "title").setScale(0.2).setDepth(11);
  }
}
