export default class RegexBreakdownScene extends Phaser.Scene {
  constructor() {
    super("RegexBreakdownScene");
  }
  preload() {
    this.load.html("regexTable", "assets/dom/regexTable.html");
  }
  create() {
    this.reduxState = store.getState();
    this.regexChoices = this.reduxState.regexChoices;
    this.regexTable = document.getElementById("regexTable");

    Object.keys(this.regexChoices).forEach((re, index) => {
      this.add.text(
        10,
        275 + 25 * index,
        `${re}                ${this.regexChoices[re].timesUsed}                 ${this.regexChoices[re].totalCharacters}`
      );
    });

    //   <tr>
    //   <td></td>
    //   <td></td>
    //   <td></td>
    //   <td></td>
    //   </tr>
  }
}
