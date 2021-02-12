import 'phaser';

const regexGroups = [
  [/[adfw]/, /[ADFW]/, /\d/, /[^adfw]/],
  [/[^ADFW]/, /\D/, /[^\w\d\s]/, /\s/],
  [/[a-f]/, /[A-F-]/, /[a*]/, /\w/],
  [/\W/, /[D-W]/, /\S/, /[^adAD]/],
  [/[^FWfw]/, /[FWfw]/, /[?#$+]/, /[/]/],
];

export default class RegexOption extends Phaser.GameObjects.Text {
  constructor(scene, x, y, idx) {
    const randIdx = Math.floor(Math.random() * 4);
    const re = regexGroups[idx][randIdx];
    super(scene, x, y, `${re}`, { fontSize: '25px' });

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.re = re;
    this.regexGroup = regexGroups[idx];
    this.currentIdx = 0;
  }

  changeRegex() {
    this.currentIdx++;
    if (this.currentIdx > 3) {
      this.currentIdx = 0;
    }
    const newRe = this.regexGroup[this.currentIdx];
    this.re = newRe;
    this.setText(`${newRe}`);
  }
}
