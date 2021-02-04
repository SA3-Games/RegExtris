import Phaser from "phaser";
import store from "../store";
import { auth } from "../store/singlePlayer";
import { width, height } from "../config/config";

export default class SignUpScene extends Phaser.Scene {
  constructor() {
    super("SignUpScene");
    this.player;
    this.error;
  }

  init() {}

  preload() {
    this.load.html("signUpForm", "assets/text/signUpForm.html");
    this.load.image("background", "assets/menuSprites/menuBG1.png");
  }

  create() {
    this.unsubscribe = store.subscribe(() => {
      this.player = store.getState().player;
      this.error = store.getState().error;
      this.errorDiv.innerHTML = this.error.message;
      if (this.player) {
        this.unsubscribe();
        this.scene.start("MenuScene");
      }
    });

    this.add.image(600, 400, "background");

    let element = this.add.dom(600, 350).createFromCache("signUpForm");

    this.signUpForm = document.getElementById("signup");
    this.errorDiv = document.getElementById("error");
    document.getElementById("signUpBox").addEventListener("keyup", (e) => {
      this.enterToSubmit(e);
    });

    this.postSubmissionAction = () => {
      let inputAlias = document.getElementById("alias");
      let inputPassword = document.getElementById("password");
      let inputConfirmPassword = document.getElementById("confirmPassword");

      //  check if fields are not empty
      if (inputAlias.value !== "" && inputPassword.value !== "") {
        // check if password and confirm passwords match
        if (inputPassword.value === inputConfirmPassword.value) {
          this.errorDiv.innerHTML = "";
          try {
            store.dispatch(
              auth(inputAlias.value, inputPassword.value, "signup")
            );
          } catch (error) {
            this.errorDiv.innerHTML = "error.message";
          }
        } else {
          this.errorDiv.innerHTML = "password does not match";
        }
      }
    };

    //function runs if you pressed enter to submit
    this.enterToSubmit = (e) => {
      if ((e && e.keyCode == 13) || e == 0) {
        this.postSubmissionAction();
      }
    };

    //function runs if you clicked submit button
    this.signUpForm.onsubmit = (event) => {
      event.preventDefault();
      this.postSubmissionAction();
    };
  }

  update() {}
}
