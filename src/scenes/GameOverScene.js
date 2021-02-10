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
    this.load.image("title", "assets/spritesheets/REGEXTRISbw2.png");
    this.load.script(
      "chartjs",
      "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js"
    );
  }

  create() {
    this.unsubscribe = store.subscribe(() => {
      this.reduxState = store.getState();
      this.scores = this.reduxState.scores;

      if (this.scores.length) {
        this.unsubscribe();
        this.unsubscribe();
      }
    });
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
    this.shift = this.input.keyboard.addKey("SHIFT");

    //Function that helps create the number of occurences a certain score happens along with their segments
    function getScoreChart(
      numSegments,
      scores,
      scoreType,
      title,
      currentScore
    ) {
      let thisScores = scores.map((score) => score[scoreType]);
      let maxScore = Math.max(...thisScores);
      let segmentSize = Math.floor(maxScore / numSegments);
      let labels = [];
      let occurences = [];
      let bgColors = [];
      for (let i = 0; i <= numSegments; i++) {
        let label = i * segmentSize;
        let numItems = 0;
        let bgColor = "rgba(255,255,255, 1)";
        thisScores.forEach((score) => {
          if (score <= label && score > (i - 1) * segmentSize) {
            numItems++;
            if (score === currentScore && scoreType === "tetrisScore") {
              bgColor = "rgba(153,0,255, 0.4)";
            } else if (score === currentScore && scoreType === "regExScore") {
              bgColor = "rgba(102,255,51, 0.4)";
            }
          }
        });
        labels.push(label);
        occurences.push(numItems);
        bgColors.push(bgColor);
      }
      let chart = {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              data: occurences,
              backgroundColor: bgColors,
              color: "white",
              borderWidth: 0,
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: title,
            fontColor: "white",
            fontSize: 14,
          },
          scales: {
            xAxes: [
              {
                categoryPercentage: 1.0,
                barPercentage: 1.0,
                ticks: {
                  fontColor: "white",
                  fontSize: 10,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Score",
                  fontColor: "white",
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

      return chart;
    }

    // Histogram Chart Creation
    //creates the tetris score chart
    let tetrisScoreChart = getScoreChart(
      6,
      this.scores,
      "tetrisScore",
      "All Users Tetris Score Breakdown",
      this.tetrisScore
    );
    //creates the Regex score chart
    let regExScoreChart = getScoreChart(
      6,
      this.scores,
      "regExScore",
      "All Users Regex Score Breakdown",
      this.regExScore
    );
    //chart that shows your scorebreakdown for this game
    let gameScore = {
      type: "doughnut",
      data: {
        labels: ["Tetris Score", "RegEx Score"],
        backgroundColor: "rgba(153,0,255, 0.4)",
        borderColor: "rgba(153,0,255, 1)",
        borderColor: ["rgba(153,0,255, 0.2)", "rgba(102,255,51, 0.2)"],
        datasets: [
          {
            data: [this.tetrisScore, this.regExScore],
            backgroundColor: ["rgba(153,0,255, 0.2)", "rgba(102,255,51, 0.2)"],
          },
        ],
      },
      options: {
        showTooltips: true,
        legend: {
          labels: {
            position: "top",
            fontColor: "white",
          },
        },
        title: {
          display: true,
          text: "Your Scores Today",
          fontColor: "white",
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        tooltip: {
          mode: "nearest",
        },
      },
    };
    //Display the The Game over Text
    this.add
      .text(600, 100, `GAME OVER!`, {
        fontSize: "24px",
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(600, 140, `Final Score: ${this.tetrisScore + this.regExScore}`, {
        fontSize: "20px",
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(600, 180, `Press enter to go back to the menu!`, {
        fontSize: "24px",
      })
      .setOrigin(0.5, 0.5);

    //displays the title
    this.title = this.add.sprite(600, 35, "title").setScale(0.2).setDepth(11);

    //displays the doughnut chart
    this.rexUI.add.chart(300, 400, 200, 100, gameScore).resize(300, 300);

    //displays the Tetris histogram
    this.rexUI.add.chart(600, 400, 200, 100, tetrisScoreChart).resize(300, 300);

    //displays the Regex histogram
    this.rexUI.add.chart(900, 400, 200, 100, regExScoreChart).resize(300, 300);
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      this.scene.start("MenuScene");
    } else if (Phaser.Input.Keyboard.JustUp(this.shift)) {
      this.scene.start("DetailedScoreScene");
    }
  }
}
