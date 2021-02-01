import "phaser";
import config from "./config/config";

import MainScene from "./scenes/MainScene";
import LoginScene from "./scenes/EmailScene";
//import Menu from './scenes/Menu';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    //this.scene.add('Menu', Menu);
    this.scene.add("MainScene", MainScene);
    this.scene.add("LoginScene", LoginScene);
    this.scene.start("LoginScene");
  }
}

new Game(config);
