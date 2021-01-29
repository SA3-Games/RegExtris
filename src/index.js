import Phaser from 'phaser';

class MyGame extends Phaser.Scene {
  constructor() {
    super(config);
  }

  preload() {
    this.load.image('logo', 'assets/backgrounds/logo.png');
  }

  create() {
    const logo = this.add.image(400, 150, 'logo');

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    });
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'regextris',
  width: 800,
  height: 600,
  scene: MyGame,
};

const game = new Phaser.Game(config);
