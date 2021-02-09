import store from "../store";
import { auth } from "../store/singlePlayer";

export default class LoginScene extends Phaser.Scene {
  constructor() {
    super("LoginScene");
    this.player;
    this.error = {};
  }
  init() {}
  preload() {
    this.load.html("loginForm", "assets/text/loginForm.html");
    this.load.image("background", "assets/menuSprites/menuBG1.png");
    this.load.image('title', 'assets/spritesheets/REGEXTRISbw2.png');
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

    this.add.image(600, 400, "background");

    this.add.dom(600, 350).createFromCache("loginForm");

    this.loginForm = document.getElementById("signup");
    this.errorDiv = document.getElementById("error");
    document.getElementById("signUpBox").addEventListener("keyup", (e) => {
      this.enterToSubmit(e);
    });

    this.postSubmissionAction = () => {
      let inputAlias = document.getElementById("alias");
      let inputPassword = document.getElementById("password");

      //  check if fields are not empty
      if (inputAlias.value !== "" && inputPassword.value !== "") {
        // check if password and confirm passwords match
        this.errorDiv.innerHTML = "";
        store.dispatch(auth(inputAlias.value, inputPassword.value, "login"));
      }
    };

    //function runs if you pressed enter to submit
    this.enterToSubmit = (e) => {
      if ((e && e.keyCode == 13) || e == 0) {
        this.postSubmissionAction();
      }
    };

    //function runs if you clicked submit button
    this.loginForm.onsubmit = (event) => {
      event.preventDefault();
      this.postSubmissionAction();
    };

    //title display
    this.title = this.add.sprite(600, 35, 'title').setScale(0.2).setDepth(11);
  }
}
