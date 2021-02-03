import store from "../store";
import { auth } from "../store/singlePlayer";

export default class PasswordScene extends Phaser.Scene {
  constructor() {
    super("PasswordScene");
    this.alias;
    this.enterText = this.enterText.bind(this);
  }

  enterText(input, password) {}

  init(data) {
    this.alias = data.alias;
  }

  preload() {}
  create() {
    this.player;
    this.password = "";
    this.unsubscribe = store.subscribe(() => {
      this.player = store.getState().player;
      if (this.player.alias === this.alias) {
        this.scene.start("MenuScene", { alias: this.alias });
      } else {
        this.scene.start("AliasScene", {
          error: "alias or password is incorrect",
        });
      }
      this.unsubscribe();
    });
    this.enter = this.input.keyboard.addKey("ENTER");

    this.add.text(10, 10, "Enter your password:", {
      font: "32px Courier",
      fill: "#ffffff",
    });

    this.passwordEntry = this.add.text(10, 50, "", {
      font: "32px Courier",
      fill: "#ffff00",
    });

    this.input.keyboard.on("keyup", (event) => {
      // if backspace is pressed and there is length, then cut of the last letter
      if (event.keyCode === 8 && this.passwordEntry.text.length > 0) {
        this.passwordEntry.text = this.passwordEntry.text.substr(
          0,
          this.passwordEntry.text.length - 1
        );
        this.password = this.password.substr(0, this.password.length - 1);
      } else if (
        event.keyCode === 32 ||
        (event.keyCode >= 48 && event.keyCode < 90)
      ) {
        this.passwordEntry.text += "*";
        this.password = this.password + event.key;
      }
    });
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      //connect to redux thunk
      store.dispatch(auth(this.alias, this.password, "login"));
    }
  }
}
