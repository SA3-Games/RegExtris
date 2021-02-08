import 'phaser';

const regexGroups = [
  [/[abfn]/, /[ABFN]/, /\d/, /[^abfn]/],
  [/[^ABFN]/, /\D/, /\s/, /[^\w\d\s]/],
  [/[a-f]/, /a*/, /[a\*]/, /\w/],
  [/\W/, /[B-N]/, /\S/, /[^abAB]/],
  [/[^FNfn]/, /[FNfn]/, /[?#$+]/, /[/]/],
];

export default class RegexOption extends Phaser.GameObjects.Text {
  constructor(scene, x, y, idx) {
    const re = regexGroups[idx][0];
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
