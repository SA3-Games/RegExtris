export default class AliasScene extends Phaser.Scene {
  constructor() {
    super("AliasScene");
    this.alias;
  }

  enterText(input) {
    this.input.keyboard.on("keyup", (event) => {
      // if backspace is pressed and there is length, then cut off the last letter
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

  preload() {}
  create() {
    this.enter = this.input.keyboard.addKey("ENTER");

    this.add.text(10, 10, "Enter your alias:", {
      font: "32px Courier",
      fill: "#ffffff",
    });

    this.aliasEntry = this.add.text(10, 50, "", {
      font: "32px Courier",
      fill: "#ffff00",
    });

    this.enterText(this.aliasEntry);
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      this.alias = this.aliasEntry.text;

      this.scene.start("PasswordScene", { alias: this.alias });
    }
  }
}
