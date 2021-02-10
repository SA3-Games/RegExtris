import store from "../store";

export default class DetailedScoreScene extends Phaser.Scene {
  constructor() {
    super("DetailedScoreScene");
  }
  preload() {
    this.load.image("title", "assets/spritesheets/REGEXTRISbw2.png");
  }
  create() {
    this.enter = this.input.keyboard.addKey("ENTER");
    this.shift = this.input.keyboard.addKey("SHIFT");

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
            backgroundColor: "rgba(153, 0, 255, 1)",
            borderColor: "rgba(153, 0, 255, 1)",
            data: this.onlyRegexScores,
          },
        ],
      },
      options: {
        legend: {
          labels: {
            fontColor: "white",
          },
        },
        title: {
          display: true,
          text: "Player Score History",
          fontSize: 24,
          fontColor: "white",
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: false,
                fontColor: "white",
                fontSize: 10,
              },
              scaleLabel: {
                display: true,
                labelString: "Games Played",
                fontColor: "white",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                display: true,
                beginAtZero: true,
                fontColor: "white",
                fontSize: 10,
              },
              scaleLabel: {
                display: true,
                labelString: "Scores",
                fontColor: "white",
              },
            },
          ],
        },
      },
    };

    //displays the line graph called scoreHistory
    this.rexUI.add
      .chart(300, 400, 200, 100, this.scoreHistory)
      .resize(500, 350);

    // display option to go back to the game over scene
    this.add
      .text(600, 100, "Press SHIFT to go back!", {
        fontSize: "24px",
        fontFamily: "retroFont",
      })
      .setOrigin(0.5, 0.5);

    // display option to go back to the Menu scene
    this.add
      .text(600, 150, "Press Enter to go back to the Menu!", {
        fontSize: "24px",
        fontFamily: "retroFont",
      })
      .setOrigin(0.5, 0.5);

    // Object.keys(this.regexChoices).forEach((re) => {
    //   console.log("inside for each", re);
    //   // clearedChars.innerHTML = this.regexChoices[re].totalCharacters;
    // });
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      this.scene.start("MenuScene");
    } else if (Phaser.Input.Keyboard.JustUp(this.shift)) {
      this.scene.start("GameOverScene");
    }
  }
}
