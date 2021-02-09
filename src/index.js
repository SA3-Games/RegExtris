import "phaser";
import config from "./config/config";

import MainScene from "./scenes/MainScene";
import MenuScene from "./scenes/MenuScene";
import SignUpScene from "./scenes/SignUpScene";
import GameOverScene from "./scenes/GameOverScene";
import LoggedOutMenu from "./scenes/LoggedOutMenu";
import LoadingScene from "./scenes/LoadingScene";
import LoginScene from "./scenes/LoginScene";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add("MainScene", MainScene);
    this.scene.add("MenuScene", MenuScene);
    this.scene.add("SignUpScene", SignUpScene);
    this.scene.add("GameOverScene", GameOverScene);
    this.scene.add("LoggedOutMenu", LoggedOutMenu);
    this.scene.add("LoadingScene", LoadingScene);
    this.scene.add("LoginScene", LoginScene);
    this.scene.start("LoadingScene", { dataLoading: "player" });
  }
}

window.game = new Game(config);
