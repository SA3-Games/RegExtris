import store from "../store";
import { postScore } from "../store/score";
import { fetchAllScores } from "../store/scores";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
    this.scorePosted = false;
  }

  init(data) {
    this.tetrisScore = data.tetrisScore || 0;
    this.regExScore = data.regExScore || 0;
    store.dispatch(fetchAllScores());
  }

  preload() {
    this.load.image("title", "assets/spritesheets/REGEXTRIScolors.png");
    this.load.script(
      "chartjs",
      "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js"
    );
  }

  create() {
    if (!this.scorePosted) {
      store.dispatch(
        postScore({
          tetrisScore: this.tetrisScore,
          regExScore: this.regExScore,
        })
      );
      this.scorePosted = true;
    }

    this.enter = this.input.keyboard.addKey("ENTER");

    this.reduxState = store.getState();
    this.regexChoices = this.reduxState.regexChoices;
    this.scores = this.reduxState.scores;

    //extract scores from all scores
    this.allTetrisScores = [];
    this.allRegexScores = [];
    console.log("redux State: " + this.reduxState);
    this.scores.forEach((scoreSet) => {
      this.allTetrisScores.push(scoreSet.tetrisScore);
      this.allRegexScores.push(scoreSet.regExScore);
      //find frequency of occurences
    });
    //The chart that displays your score broken down by Tetris score and Regex Score
    let gameScore = {
      type: "bar",
      data: {
        labels: ["Tetris", "Regex"],
        datasets: [
          {
            data: [this.tetrisScore, this.regExScore],
            backgroundColor: ["rgba(153,0,255, 0.2)", "rgba(102,255,51, 0.2)"],
            borderColor: "white",
            color: "white",
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Your Score Breakdown",
          fontColor: "white",
          fontSize: 14,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "white",
                fontSize: 10,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: "white",
                fontSize: 10,
              },
            },
          ],
        },
      },
    };

    this.rexUI.add.chart(300, 400, 200, 100, gameScore).resize(200, 200);

    let allScores = {
      type: "bar",
      data: {
        datasets: [
          {
            data: [this.allTetrisScores],
            backgroundColor: ["rgba(153,0,255, 0.2)", "rgba(102,255,51, 0.2)"],
            borderColor: "white",
            color: "white",
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "All Users Scores Breakdown",
          fontColor: "white",
          fontSize: 14,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 500,
                fontColor: "white",
                fontSize: 10,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: "white",
                fontSize: 10,
              },
            },
          ],
        },
      },
    };

    this.rexUI.add.chart(600, 400, 200, 100, allScores).resize(200, 200);
    this.add
      .text(600, 80, `GAME OVER!`, {
        fontSize: "24px",
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        600,
        120,
        `Final Tetris Score: ${this.tetrisScore}  Final RegEx Score: ${this.regExScore}`,
        {
          fontSize: "20px",
        }
      )
      .setOrigin(0.5, 0.5);
    this.add
      .text(600, 160, `Press enter to go back to the menu!`, {
        fontSize: "24px",
      })
      .setOrigin(0.5, 0.5);

    // Object.keys(this.regexChoices).forEach((re, index) => {
    //   this.add.text(
    //     10,
    //     275 + 25 * index,
    //     `${re}                ${this.regexChoices[re].timesUsed}                 ${this.regexChoices[re].totalCharacters}`
    //   );
    // });

    //title display
    this.title = this.add.sprite(600, 20, "title").setScale(0.2).setDepth(11);
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      this.scene.start("MenuScene");
    }
  }
}
