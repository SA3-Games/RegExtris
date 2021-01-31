import 'phaser';
import config from './config/config';

import MainScene from './scenes/MainScene';
//import Menu from './scenes/Menu';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    //this.scene.add('Menu', Menu);
    this.scene.add('MainScene', MainScene);
    this.scene.start('MainScene');
  }
}

new Game(config);
