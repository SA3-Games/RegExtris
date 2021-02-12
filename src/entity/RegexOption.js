import 'phaser';

const regexGroups = [
  [/[a-w]/, /[A-W]/, /\d/, /[^a-w]/],
  [/[^A-W]/, /\D/, /[^\w\d\s]/, /\s/],
  [/[a-wA-W]/, /[-awAW]/, /[a*]/, /\w/],
  [/\W/, /[D-W]/, /\S/, /[^adAD]/],
  [/[^FWfw]/, /[FWfw-]/, /[*?#]/, /[/$-]/],
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
