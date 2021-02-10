import store from "../store";

export default class DetailedScoreScene extends Phaser.Scene {
  constructor() {
    super("DetailedScoreScene");
  }
  preload() {
    this.load.image("title", "assets/spritesheets/REGEXTRISbw2.png");
  }
  create() {
    // Displays the title sprite
    this.title = this.add.sprite(600, 35, "title").setScale(0.2).setDepth(11);

    this.reduxState = store.getState();
    this.scores = this.reduxState.score;
    this.regexChoices = this.reduxState.regexChoices;

    // create arrays to input into score history chart
    this.gameNum = [];
    this.onlyTetrisScores = [];
    this.onlyRegexScores = [];
    this.scores.map((score, index) => {
      this.gameNum.push(index + 1);
      this.onlyTetrisScores.push(score.tetrisScore);
      this.onlyRegexScores.push(score.regExScore);
    });

    //line graph that shows Your scores through the time you've played it on the current account
    this.scoreHistory = {
      type: "line",
      data: {
        labels: this.gameNum,
        datasets: [
          {
            label: "Tetris",
            backgroundColor: "yellow",
            borderColor: "yellow",
            data: this.onlyTetrisScores,
            fill: false,
          },
          {
            label: "Regex",
            fill: false,
            backgroundColor: "blue",
            borderColor: "blue",
            data: this.onlyRegexScores,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Player Score History",
            fontColor: "white",
          },
        },
        scales: {
          x: {
            display: false,
            fontColor: "white",
            scaleLabel: {
              display: true,
              labelString: "Games",
              fontColor: "white",
            },
          },
          y: {
            display: true,
            fontColor: "white",
            scaleLabel: {
              display: true,
              labelString: "Scores",
              fontColor: "white",
            },
          },
        },
      },
    };

    //displays the line graph called scoreHistory
    this.rexUI.add
      .chart(300, 400, 200, 100, this.scoreHistory)
      .resize(300, 300);

    // Object.keys(this.regexChoices).forEach((re) => {
    //   console.log("inside for each", re);
    //   // clearedChars.innerHTML = this.regexChoices[re].totalCharacters;
    // });
  }
}
