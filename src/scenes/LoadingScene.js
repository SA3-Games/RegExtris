import "phaser";
import store from "../store";
import { me } from "../store/singlePlayer";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
  }
  init(data) {
    this.dataLoading = data.dataLoading;
  }

  preload() {
    this.load.image('title', 'assets/spritesheets/REGEXTRIScolors.png');
  }
  
  create() {
    this.add.text(10, 10, "Loading", {
      font: "32px Courier",
      fill: "#ffffff",
    });
    store.dispatch(me());
    this.title = this.add.sprite(600, 20, 'title').setScale(0.2).setDepth(11);
  }

  update() {
    this.state = store.getState();
    if (this.dataLoading === "player" && this.state.player) {
      if (this.state.player.id === null) {
        this.scene.start("LoggedOutMenu");
      } else if (this.state.player.id) {
        this.scene.start("MenuScene");
      } else if (this.state.player === "error") {
        // dispatch()
      }
    }
  }
}
