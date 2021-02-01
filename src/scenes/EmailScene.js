export default class EmailScene extends Phaser.Scene {
  constructor() {
    super("EmailScene");
    this.email = "";
    this.enterText = this.enterText.bind(this);
  }

  enterText(textEntry) {
    this.input.keyboard.on("keyup", function (event) {
      // if backspace is pressed and there is length, then cut of the last letter
      if (event.keyCode === 8 && textEntry.text.length > 0) {
        textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
      } else if (
        event.keyCode === 32 ||
        (event.keyCode >= 48 && event.keyCode < 90)
      ) {
        textEntry.text += event.key;
      } else if (event.keyCode === 13) {
        this.email = textEntry.text;
      }
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

    this.enterText(this.emailEntry);
  }

  update() {
    if (
      this.inputField === "email" &&
      Phaser.Input.Keyboard.JustUp(this.enter)
    ) {
      console.log("inside update", this[email]);
    }
  }
}
