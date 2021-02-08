import Phaser from "phaser";
import store from "../store";
import { me } from "../store/singlePlayer";

export default class LoggedOutMenu extends Phaser.Scene {
  constructor() {
    super("LoggedOutMenu");
    this.cursors;
    this.selectedButtonIndex = 0;
    this.buttonSelector;
    this.alias = "";
    this.logOutButton;
  }

  init(data) {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.image("Neon-Box", "assets/menuSprites/neonBlueBox.png");
    this.load.image("FAIRY", "assets/menuSprites/FAIRY.png");
    this.load.image("background", "assets/menuSprites/menuBG1.png");
    this.load.image('title', 'assets/spritesheets/REGEXTRIScolors.png');
  }

  create() {
    // this.unsubscribe = store.subscribe(() => {

    // })
    // if (this.player.id) {
    //   this.scene.start("MenuScene", { player: this.player });
    // }

    const width = 1200;
    const height = 800;
    this.selectedButtonIndex = 0;
    this.buttons = [];
    this.enter = this.input.keyboard.addKey("ENTER");

    store.dispatch(me());
    this.player = store.getState().player;

    //Setting background
    this.add.image(600, 400, "background");

    // instructions
    this.add.text(360, 100, "Use arrow keys to move\nUse enter key to select", {
      fontFamily: "retroFont",
      fontSize: 30,
    });

    // Log in button
    const logInButton = this.add
      .image(width * 0.5, height * 0.4, "Neon-Box")
      .setDisplaySize(150, 50);

    this.add
      .text(logInButton.x, logInButton.y, "Log In", {
        fontFamily: "retroFont",
      })
      .setOrigin(0.5);

    // Sign Up button
    const signUpButton = this.add
      .image(
        logInButton.x,
        logInButton.y + logInButton.displayHeight + 10,
        "Neon-Box"
      )
      .setDisplaySize(150, 50);
    this.add
      .text(signUpButton.x, signUpButton.y, "Sign Up", {
        fontFamily: "retroFont",
      })
      .setOrigin(0.5);

    this.buttons.push(logInButton);
    this.buttons.push(signUpButton);

    logInButton.on("selected", () => {
      this.scene.start("LoginScene");
    });

    signUpButton.on("selected", () => {
      this.scene.start("SignUpScene");

      //each .on() should have a matching .off() to ensure that events are cleaned up.
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        logInButton.off("selected");
        signUpButton.off("selected");
      });
    });

    //sets the cursor
    this.buttonSelector = this.add.image(0, 0, "FAIRY").setScale(0.2);

    this.selectButton(0);

    //title display
    this.title = this.add.sprite(600, 20, 'title').setScale(0.2).setDepth(11);
  }

  selectButton(index) {
    const currentButton = this.buttons[this.selectedButtonIndex];
    // set the current selected button to a white tint
    currentButton.setTint(0xffffff);
    const button = this.buttons[index];
    // set the newly selected button to a green tint
    button.setTint(0x66ff7f);
    // move the hand cursor to the right edge
    this.buttonSelector.x = button.x - button.displayWidth * 0.6;
    this.buttonSelector.y = button.y + 10;
    // store the new selected index
    this.selectedButtonIndex = index;
  }

  selectNextButton(change = 1) {
    let index = this.selectedButtonIndex + change;
    // wrap the index to the front or end of array
    if (index >= this.buttons.length) {
      index = 0;
    } else if (index < 0) {
      index = this.buttons.length - 1;
    }
    this.selectButton(index);
  }

  confirmSelection() {
    // get the currently selected button
    const button = this.buttons[this.selectedButtonIndex];
    // emit the 'selected' event
    button.emit("selected");
  }

  update() {
    this.player = store.getState().player;
    if (this.player.alias) {
      this.scene.start("MenuScene", { player: this.player });
    }
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
    const enterJustPressed = Phaser.Input.Keyboard.JustDown(this.enter);
    if (upJustPressed) {
      this.selectNextButton(-1);
    } else if (downJustPressed) {
      this.selectNextButton(1);
    } else if (enterJustPressed) {
      this.confirmSelection();
    }
  }
}
