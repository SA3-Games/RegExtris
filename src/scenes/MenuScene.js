import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
    this.cursors;
    this.buttons = [];
    this.selectedButtonIndex = 0;
    this.buttonSelector;
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.image("glass-panel", "assets/menuSprites/glassPanel.png");
    this.load.image("cursor-hand", "assets/menuSprites/cursor_hand.png");
  }

  create() {
    const width = 1200;
    const height = 800;

    // Log in button
    const logInButton = this.add
      .image(width * 0.5, height * 0.6, "glass-panel")
      .setDisplaySize(150, 50);

    this.add.text(logInButton.x, logInButton.y, "Log In").setOrigin(0.5);

    // Sign Up button
    const signUpButton = this.add
      .image(
        logInButton.x,
        logInButton.y + logInButton.displayHeight + 10,
        "glass-panel"
      )
      .setDisplaySize(150, 50);

    this.add.text(signUpButton.x, signUpButton.y, "Sign Up").setOrigin(0.5);

    // Colorblind Mode button
    const colorBlindButton = this.add
      .image(
        signUpButton.x,
        signUpButton.y + signUpButton.displayHeight + 10,
        "glass-panel"
      )
      .setDisplaySize(150, 50);

    this.add
      .text(colorBlindButton.x, colorBlindButton.y, "Colorblind Mode")
      .setOrigin(0.5);

    // Exit Game button
    const exitButton = this.add
      .image(
        colorBlindButton.x,
        colorBlindButton.y + colorBlindButton.displayHeight + 10,
        "glass-panel"
      )
      .setDisplaySize(150, 50);

    this.add.text(exitButton.x, exitButton.y, "Exit Game").setOrigin(0.5);

    this.buttons.push(logInButton);
    this.buttons.push(signUpButton);
    this.buttons.push(colorBlindButton);
    this.buttons.push(exitButton);
    this.buttonSelector = this.add.image(0, 0, "cursor-hand");
    this.selectButton(0);

    logInButton.on("selected", () => {
      //this is where you'd connect the button with logging in - different scene?
      console.log("Log In");
    });

    signUpButton.on("selected", () => {
      //this is where you'd connect the button with signing up - different scene?
      console.log("Sign Up");
    });

    colorBlindButton.on("selected", () => {
      //this is where you'd connect the button with changing the color scheme of the game to black and white and grey
      console.log("colorBlind");
    });

    exitButton.on("selected", () => {
      //this is where you'd connect the button with exiting the game
      console.log("exit");
    });

    //each .on() should have a matching .off() to ensure that events are cleaned up.
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      logInButton.off("selected");
      signUpButton.off("selected");
      colorBlindButton.off("selected");
      exitButton.off("selected");
    });
  }

  selectButton(index) {
    const currentButton = this.buttons[this.selectedButtonIndex];

    // set the current selected button to a white tint
    currentButton.setTint(0xffffff);

    const button = this.buttons[index];

    // set the newly selected button to a green tint
    button.setTint(0x66ff7f);

    // move the hand cursor to the right edge
    this.buttonSelector.x = button.x + button.displayWidth * 0.5;
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
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if (upJustPressed) {
      this.selectNextButton(-1);
    } else if (downJustPressed) {
      this.selectNextButton(1);
    } else if (spaceJustPressed) {
      this.confirmSelection();
    }
  }
}

// export default class MenuScene extends Phaser.Scene {
//     constructor() {
//       super('MenuScene');
//       this.alias;
//     }

//     init(data) {
//         this.alias = data.alias;
//     }

//     create() {
//         this.enter = this.input.keyboard.addKey("ENTER");
//         this.add.text(100, 200,
//             `Hello, ${this.alias}!\n\nWelcome to RegExtris!\n\nPress enter to start your game!`
//             );
//     }

//     update() {
//         if (Phaser.Input.Keyboard.JustUp(this.enter)) {
//             this.scene.start("MainScene");
//           }
//     }
// }
