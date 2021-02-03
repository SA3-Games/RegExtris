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

      console.log("not unique", this.error);
    });

    this.add.image(600, 400, "background");

    let text = this.add.text(width * 0.5, 20, "Please sign up to play", {
      color: "white",
      fontSize: "32px ",
    });

    let element = this.add.dom(400, 600).createFromCache("signUpForm");

    element.setPerspective(800);

    element.addListener("click");

    element.on("click", function (event) {
      if (event.target.name === "signUpButton") {
        let inputAlias = this.getChildByName("Alias");
        let inputPassword = this.getChildByName("password");
        let inputConfirmPassword = this.getChildByName("confirmPassword");

        //  check if fields are not empty
        if (inputAlias.value !== "" && inputPassword.value !== "") {
          // check if password and confirm passwords match
          if (inputPassword.value === inputConfirmPassword.value) {
            // errorDiv.style.display = "none";
            store.dispatch(
              auth(inputAlias.value, inputPassword.value, "signup")
            );
          } else {
            alert("password and confirm password do not match");
          }

          //  Turn off the click events
          this.removeListener("click");

          //  Tween the sign Up after use
          // this.scene.tweens.add({
          //   targets: element.rotate3d,
          //   x: 1,
          //   w: 90,
          //   duration: 3000,
          //   ease: "Power3",
          // });
        } else {
          //  Flash the prompt
          this.scene.tweens.add({
            targets: text,
            alpha: 0.1,
            duration: 200,
            ease: "Power3",
            yoyo: true,
          });
        }
      }
    });

    this.tweens.add({
      targets: element,
      y: 300,
      duration: 10,
      ease: "Power3",
    });
  }

  update() {}
}
