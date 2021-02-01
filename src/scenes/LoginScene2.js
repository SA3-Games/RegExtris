export default class LoginScene extends Phaser.Scene {
  constructor() {
    super("LoginScene");
    this.email = "";
    this.password = "";
    this.inputField = "email";
    this.pressOnce = true;
    this.enterText = this.enterText.bind(this);
  }

  enterText(textEntry, field) {
    this.input.keyboard.on("keyup", function (event) {
      // if (Phaser.Input.Keyboard.JustUp(event.keyCode)) {
      // if backspace is pressed and there is length, then cut of the last letter
      if (event.keyCode === 8 && textEntry.text.length > 0) {
        textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
      } else if (
        event.keyCode === 32 ||
        (event.keyCode >= 48 && event.keyCode < 90)
      ) {
        textEntry.text += event.key;
        console.log("stroke", textEntry.text);
      } else if (event.keyCode === 13) {
        this[field] = textEntry.text;
        console.log(field, "after enter", this[field]);
        this.inputField = "password";
      }
      // }
    });
  }

  preload() {}
  create() {
    this.enter = this.input.keyboard.addKey("ENTER");

    this.add.text(10, 10, "Enter your email:", {
      font: "32px Courier",
      fill: "#ffffff",
    });

    this.emailEntry = this.add.text(10, 50, "", {
      font: "32px Courier",
      fill: "#ffff00",
    });

    this.add.text(10, 100, "Enter your password:", {
      font: "32px Courier",
      fill: "#ffffff",
    });
    this.passwordEntry = this.add.text(10, 150, "", {
      font: "32px Courier",
      fill: "#ffff00",
    });

    if (this.inputField === "email" && this.pressOnce) {
      this.enterText(this.emailEntry, "email");
      this.pressOnce = !this.pressOnce;
    } else if (this.inputField === "password" && this.pressOnce) {
      this.enterText(this.passwordEntry, "password");
    }
    this.pressOnce = !this.pressOnce;
  }

  update() {
    if (
      this.inputField === "email" &&
      Phaser.Input.Keyboard.JustUp(this.enter)
    ) {
      console.log("inside update", this[email]);
      // this.inputField = "password";
    }
  }
}
