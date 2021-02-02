export default class MenuScene extends Phaser.Scene {
    constructor() {
      super('MenuScene');
      this.alias;
    }

    init(data) {
        this.alias = data.alias;
    }
    
    create() {
        this.enter = this.input.keyboard.addKey("ENTER");
        this.add.text(100, 200, 
            `Hello, ${this.alias}!\n\nWelcome to RegExtris!\n\nPress enter to start your game!`
            );
    }

    update() {
        if (Phaser.Input.Keyboard.JustUp(this.enter)) {
            this.scene.start("MainScene");
          }
    }
  }