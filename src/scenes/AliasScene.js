export default class AliasScene extends Phaser.Scene {
  constructor() {
    super("AliasScene");
    this.alias = "";
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

    this.input.keyboard.on("keyup", (event) => {
      // if backspace is pressed and there is length, then cut off the last letter
      if (event.keyCode === 8 && this.alias.length > 0) {
        this.alias = this.alias.substr(0, this.alias.length - 1);
      } else if (
        event.keyCode === 32 ||
        (event.keyCode >= 48 && event.keyCode < 90)
      ) {
        this.alias += event.key;
      }
      this.aliasEntry.setText(this.alias);
    });
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      this.scene.start("PasswordScene", { alias: this.alias });
    }
  }
}
