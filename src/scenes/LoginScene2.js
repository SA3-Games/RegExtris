export default class LoginScene extends Phaser.Scene {
  constructor() {
    super("LoginScene");
  }

  preload() {}
  create() {
    this.add.text(10, 10, "Enter your name:", {
      font: "32px Courier",
      fill: "#ffffff",
    });

    this.textEntry = this.add.text(10, 50, "", {
      font: "32px Courier",
      fill: "#ffff00",
    });

    this.input.keyboard.on("keydown", function (event) {
      if (event.keyCode === 8 && this.textEntry.text.length > 0) {
        this.textEntry.text = this.textEntry.text.substr(
          0,
          this.textEntry.text.length - 1
        );
      } else if (
        event.keyCode === 32 ||
        (event.keyCode >= 48 && event.keyCode < 90)
      ) {
        this.textEntry.text += event.key;
      }
    });
  }

  update() {
    console.log(this.textEntry.text);
  }
}
