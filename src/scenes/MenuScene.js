import Phaser from "phaser";
import store from "../store";
import { me, logout } from "../store/singlePlayer";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
    this.cursors;
    this.selectedButtonIndex = 0;
    this.buttonSelector;
    this.alias;
    this.logOutButton;
    this.loggingOut = false;
  }

  init(data) {
    this.cursors = this.input.keyboard.createCursorKeys();
    // this.player = data.player;
    console.log("logged in menu init function", this.player);
  }

  preload() {
    this.load.image("Neon-Box", "assets/menuSprites/neonBlueBox.png");
    this.load.image("FAIRY", "assets/menuSprites/FAIRY.png");
    this.load.image("background", "assets/menuSprites/menuBG1.png");
    this.load.image('title', 'assets/spritesheets/REGEXTRISbw.png');
  }

  create() {
    const width = 1200;
    const height = 800;
    this.selectedButtonIndex = 0;
    this.buttons = [];
    this.enter = this.input.keyboard.addKey("ENTER");

    store.dispatch(me());
    this.player = store.getState().player;

    // this.unsubscribe = store.subscribe(() => {
    //   this.player = store.getState().player;
    //   if (!this.player.id) {
    //     console.log("there should be no more player and scene should restart");
    //     this.loggingOut = false;
    //     this.scene.restart("MenuScene");
    //   }
    // });

    //Setting background
    this.add.image(600, 400, "background");

    // instructions
    this.add.text(360, 100, "Use arrow keys to move\nUse enter key to select", {
      fontFamily: "retroFont",
      fontSize: 30,
    });

    // PLAY button
    const PLAYButton = this.add
      .image(width * 0.5, height * 0.4, "Neon-Box")
      .setDisplaySize(300, 100);
    this.add
      .text(PLAYButton.x, PLAYButton.y, "PLAY", {
        fontFamily: "retroFont",
        fontSize: 64,
      })
      .setOrigin(0.5);

    PLAYButton.on("selected", () => {
      //this is where you'd connect the button with PLAYing the game
      this.scene.start("MainScene");
      console.log("PLAY");
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      PLAYButton.off("selected");
    });

    //Learn Mode button
    const learnModeButton = this.add
      .image(
        PLAYButton.x,
        PLAYButton.y + PLAYButton.displayHeight + 10,
        "Neon-Box"
      )
      .setDisplaySize(150, 50);
    this.add
      .text(learnModeButton.x, learnModeButton.y, "Learn Mode", {
        fontFamily: "retroFont",
      })
      .setOrigin(0.5);

    // Log out button
    this.logOutButton = this.add
      .image(
        learnModeButton.x,
        learnModeButton.y + learnModeButton.displayHeight + 10,
        "Neon-Box"
      )
      .setDisplaySize(150, 50);
    this.add
      .text(this.logOutButton.x, this.logOutButton.y, "Log Out", {
        fontFamily: "retroFont",
      })
      .setOrigin(0.5);

    this.buttons.push(PLAYButton);
    this.buttons.push(learnModeButton);
    this.buttons.push(this.logOutButton);

    learnModeButton.on("selected", () => {
      console.log("learn mode");
    });

    this.logOutButton.on("selected", () => {
      // if (!this.loggingOut) {
      store.dispatch(logout());
      // this.loggingOut = true;
      // }
    });

    //each .on() should have a matching .off() to ensure that events are cleaned up.
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      learnModeButton.off("selected");
      this.logOutButton.off("selected");
    });

    //sets the cursor
    this.buttonSelector = this.add.image(0, 0, "FAIRY").setScale(0.2);

    this.selectButton(0);

    this.title = this.add.sprite(600, 35, 'title').setScale(0.2).setDepth(11);
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
    if (!this.player.id) {
      this.scene.start("LoggedOutMenu");
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
