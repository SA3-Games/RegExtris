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

  create() {
    this.add.text(10, 10, "Loading...", {
      font: "32px Courier",
      fill: "#ffffff",
    });
    store.dispatch(me());
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
