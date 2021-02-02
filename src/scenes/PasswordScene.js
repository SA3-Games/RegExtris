export default class PasswordScene extends Phaser.Scene {
    constructor() {
      super("PasswordScene");
      this.alias;
      this.password;
      this.enterText = this.enterText.bind(this);
    }
  
    enterText(input) {
      this.input.keyboard.on("keyup", function (event) {
        // if backspace is pressed and there is length, then cut of the last letter
        if (event.keyCode === 8 && input.text.length > 0) {
        input.text = input.text.substr(0, input.text.length - 1);
        } else if (
          event.keyCode === 32 ||
          (event.keyCode >= 48 && event.keyCode < 90)
        ) {
          input.text += event.key;
        }
      });
    }

    init(data) {
        this.alias = data.alias;
    }
  
    preload() {}
    create() {
      this.enter = this.input.keyboard.addKey("ENTER");
  
      this.add.text(10, 10, "Enter your password:", {
        font: "32px Courier",
        fill: "#ffffff",
      });
  
      this.passwordEntry = this.add.text(10, 50, "", {
        font: "32px Courier",
        fill: "#ffff00",
      });
  
      this.enterText(this.passwordEntry);
    }
  
    update() {
      if (Phaser.Input.Keyboard.JustUp(this.enter)) {
        this.password = this.passwordEntry.text;
        console.log("alias", this.alias, "password", this.password);
        this.scene.start("MenuScene", {alias: this.alias});
      }
    }
  }
  