import Phaser from "phaser";
import store from "../store";
import { auth } from "../store/singlePlayer";
import { width, height } from "../config/config";

export default class SignUpScene extends Phaser.Scene {
  constructor() {
    super("SignUpScene");
  }

  init() {}

  preload() {
    this.load.html("signUpForm", "assets/text/signUpForm.html");
    this.load.image("background", "assets/menuSprites/menuBG1.png");
  }

  create() {
    this.add.image(600, 400, "background");

    let text = this.add.text(width * 0.5, 20, "Please login to play", {
      color: "white",
      fontSize: "32px ",
    });

    let element = this.add.dom(400, 600).createFromCache("signUpForm");

    element.setPerspective(800);

    element.addListener("click");

    element.on("click", function (event) {
      if (event.target.name === "loginButton") {
        let inputUsername = this.getChildByName("username");
        let inputPassword = this.getChildByName("password");
        let inputConfirmPassword = this.getChildByName("confirmPassword");

        //  Have they entered anything?
        if (inputUsername.value !== "" && inputPassword.value !== "") {
          //  Turn off the click events
          this.removeListener("click");

          //  Tween the sign Up form out
          this.scene.tweens.add({
            targets: element.rotate3d,
            x: 1,
            w: 90,
            duration: 3000,
            ease: "Power3",
          });

          this.scene.tweens.add({
            targets: element,
            scaleX: 2,
            scaleY: 2,
            y: 700,
            duration: 3000,
            ease: "Power3",
            onComplete: function () {
              element.setVisible(false);
            },
          });

          //  Populate the text with whatever they typed in as the username!
          text.setText("Welcome " + inputUsername.value);
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
      duration: 3000,
      ease: "Power3",
    });
  }

  update() {}
}
