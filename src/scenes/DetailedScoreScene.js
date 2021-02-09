import store from "../store";

export default class DetailedScoreScene extends Phaser.Scene {
  constructor() {
    super("DetailedScoreScene");
  }
  preload() {
    this.load.image("title", "assets/spritesheets/REGEXTRISbw2.png");
  }
  create() {
    console.log("inside regex breakdown scene");

    this.title = this.add.sprite(600, 35, "title").setScale(0.2).setDepth(11);

    this.reduxState = store.getState();
    this.scores = this.reduxState.score;
    this.regexChoices = this.reduxState.regexChoices;

    // create arrays to input into score history chart
    this.createdAt = [];
    this.onlyTetrisScores = [];
    this.onlyRegexScores = [];
    this.scores.map((score) => {
      this.createdAt.push(score.createdAt);
      this.onlyTetrisScores.push(score.tetrisScore);
      this.onlyRegexScores.push(score.regExScore);
    });

    this.scoreHistory = {
      type: "line",
      data: {
        labels: this.createdAt,
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
            },
          },
        },
      },
    };

    this.rexUI.add
      .chart(300, 400, 200, 100, this.scoreHistory)
      .resize(300, 300);

    // Object.keys(this.regexChoices).forEach((re) => {
    //   console.log("inside for each", re);
    //   // clearedChars.innerHTML = this.regexChoices[re].totalCharacters;
    // });
  }
}
