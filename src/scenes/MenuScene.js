import store from "../store";
import { me } from "../store/singlePlayer";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
    this.alias;
  }

  init(data) {
    this.alias = data.alias;
  }

  create() {
    store.dispatch(me());
    this.unsubscribe = store.subscribe(() => {
      this.player = store.getState().player;
      this.unsubscribe();
    });
    this.enter = this.input.keyboard.addKey("ENTER");
    this.add.text(
      100,
      200,
      `Hello, ${this.alias}!\n\nWelcome to RegExtris!\n\nPress enter to start your game!`
    );
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      this.scene.start("MainScene");
    }
  }
}
