export default class GameOverScene extends Phaser.Scene {
    constructor() {
      super('GameOverScene');
    }

    preload() {
    }   
  
    create() {
        this.enter = this.input.keyboard.addKey("ENTER");
        
        this.add.text(10, 10, `GAME OVER.\n\nPress enter to go back to the menu!`);
    }

    update() {
        if (Phaser.Input.Keyboard.JustUp(this.enter)) {
            this.scene.start("MenuScene");
          }
    }
  }