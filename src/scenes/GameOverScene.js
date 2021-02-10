import store from "../store";
import { postScore } from "../store/score";
import { fetchHistData } from "../store/histogram";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
    this.scorePosted = false;
  }

  init(data) {
    this.tetrisScore = data.tetrisScore || 0;
    this.regExScore = data.regExScore || 0;
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
      console.log(this.reduxState);

      if (this.reduxState.histogram.tetrisBins) {
        console.log("histogram data exists");
        this.histogramData = this.reduxState.histogram;
        // Histogram Chart Creation
        //creates the tetris score chart
        let tetrisScoreChart = getScoreChart(
          "All Users Tetris Score Breakdown",
          this.tetrisScore,
          this.histogramData.tetrisBins,
          this.histogramData.tetrisFreqs,
          "tetris"
        );
        //creates the Regex score chart
        let regExScoreChart = getScoreChart(
          "All Users Regex Score Breakdown",
          this.regExScore,
          this.histogramData.regexBins,
          this.histogramData.regexFreqs,
          "regEx"
        );
        //displays the Tetris histogram
        this.rexUI.add
          .chart(600, 400, 200, 100, tetrisScoreChart)
          .resize(300, 300);

        //displays the Regex histogram
        this.rexUI.add
          .chart(900, 400, 200, 100, regExScoreChart)
          .resize(300, 300);
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
    function getScoreChart(title, currentScore, bins, frequencies, scoreType) {
      let bgColors = [];
      for (let i = 0; i <= bins.length; i++) {
        let bgColor = "rgba(255,255,255, 1)";
        if (currentScore > bins[i] && currentScore <= bins[i + 1]) {
          bgColor =
            scoreType === "tetris"
              ? "rgba(153,0,255, 0.4)"
              : "rgba(102,255,51, 0.4)";
        }
        bgColors.push(bgColor);
      }
      let chart = {
        type: "bar",
        data: {
          labels: bins,
          datasets: [
            {
              data: frequencies,
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
                  display: false,
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

    //chart that shows your scorebreakdown for this game
    let gameScore = {
      type: "doughnut",
      data: {
        labels: ["Tetris: " + this.tetrisScore, "RegEx: " + this.regExScore],
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

    // display option for in depth charts
    this.add
      .text(600, 650, "Press shift to see more charts!", {
        fontSize: "24px",
      })
      .setOrigin(0.5, 0.5);
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      this.scene.start("MenuScene");
    } else if (Phaser.Input.Keyboard.JustUp(this.shift)) {
      this.scene.start("DetailedScoreScene");
    }
  }
}
