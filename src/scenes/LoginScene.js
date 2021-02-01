import "phaser";
import axios from "axios";

export default class LoginScene extends Phaser.Scene {
  constructor() {
    super("LoginScene");
  }
  preload() {
    this.load.html("loginForm", "assets/loginform.html");
  }
  create() {
    const element = this.add.dom(400, 600).createFromCache("loginForm");
    element.setPerspective(800);
    element.addListener("click");
    element.on("click", (evt) => {
      if (evt.target.name === "loginButton") {
        const inputUserName = this.getChildByName("username");
        const inputPassword = this.getChildByName("password");
        if (inputUserName.value.length && inputPassword.value.length) {
          try {
            const player = axios.post("/auth/login", {
              email: inputUserName,
              password: inputPassword,
            });
            console.log("player login info", player);
          } catch (error) {
            const errorMessage = this.getChildByID("error");
            errorMessage.innerText = error.message;
            console.log("login error", error);
          }
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
}
