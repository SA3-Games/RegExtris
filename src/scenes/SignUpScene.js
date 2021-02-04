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
      console.log(this.error);
      this.errorDiv.innerHTML = this.error.message;
    });

    this.add.image(600, 400, "background");

    let element = this.add.dom(600, 350).createFromCache("signUpForm");

    let signUpForm = document.getElementById("signup");
    this.errorDiv = document.getElementById("error");

    signUpForm.onsubmit = (event) => {
      event.preventDefault();
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

        //  Tween the sign Up after use
        // this.scene.tweens.add({
        //   targets: element.rotate3d,
        //   x: 1,
        //   w: 90,
        //   duration: 3000,
        //   ease: "Power3",
        // });
        // } else {
        //  Flash the prompt
        // this.scene.tweens.add({
        //   targets: text,
        //   alpha: 0.1,
        //   duration: 200,
        //   ease: "Power3",
        //   yoyo: true,
        // });
      }
    };

    this.tweens.add({
      targets: element,
      y: 300,
      duration: 100,
      ease: "Power3",
    });
  }

  update() {}
}
