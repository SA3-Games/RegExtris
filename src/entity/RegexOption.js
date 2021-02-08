import 'phaser';

const RegexGroups = [
  [/[abfn]/, /[ABFN]/, /\d/, /[^abfn]/],
  [/[^ABFN]/, /\D/, /\s/, /[^\w\d\s]/],
  [/[a-f]/, /a*/, /[a\*]/, /\w/],
  [/\W/, /[B-N]/, /\S/, /[^abAB]/],
  [/[^FNfn]/, /[FNfn]/, /[?#$+]/, /[/]/],
];

export default class RegexOption extends Phaser.GameObjects.Text {
  constructor(scene, x, y) {
    const re = Phaser.Math.RND.pick(regexData);
    super(scene, x, y, `${re}`, { fontSize: '25px' });

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.re = re;
  }
}
