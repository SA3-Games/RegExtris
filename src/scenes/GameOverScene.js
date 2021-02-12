import store from "../store";
import { postScore } from "../store/score";
import { toggleSwitch } from "../store/histogram";
import { clearPlayerData } from "../store/playerRegex";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
    this.scorePosted = false;
    this.tetrisScore;
    this.regExScore;
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
    //dispatches the current game's scores to the store
    if (!this.scorePosted) {
      store.dispatch(
        postScore({
          tetrisScore: this.tetrisScore,
          regExScore: this.regExScore,
        })
      );
      this.scorePosted = true;
    }

    //toggling the state so that it refreshes when you come back from extra charts scene
    store.dispatch(toggleSwitch());
    this.alias = store.getState().player.alias;
    this.unsubscribe = store.subscribe(() => {
      this.reduxState = store.getState();

      if (this.reduxState.histogram.histData) {
        this.histogramData = this.reduxState.histogram.histData;
        this.tetrisBins = this.histogramData.tetrisBins;
        this.regexBins = this.histogramData.regexBins;
        this.regexFreqs = this.histogramData.regexFreqs;
        this.tetrisFreqs = this.histogramData.tetrisFreqs;

        // Histogram Chart Creation
        //creates the tetris score chart
        let tetrisScoreChart = getScoreChart(
          "All Players Tetris Breakdown",
          this.tetrisScore,
          this.tetrisBins,
          this.tetrisFreqs,
          "tetris"
        );
        //creates the Regex score chart
        let regExScoreChart = getScoreChart(
          "All Players Regex Breakdown",
          this.regExScore,
          this.regexBins,
          this.regexFreqs,
          "regEx"
        );
        //displays the Tetris histogram
        this.rexUI.add
          .chart(300, 400, 200, 100, tetrisScoreChart)
          .resize(300, 300);

        //displays the Regex histogram
        this.rexUI.add
          .chart(900, 400, 200, 100, regExScoreChart)
          .resize(300, 300);

        this.unsubscribe();
      }
    });

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
              ? "rgba(229, 170, 49, 1)"
              : "rgba(153, 0, 255, 1)";
        } else if (
          currentScore > bins[bins.length - 1] &&
          i === bins.length - 1
        ) {
          bgColor =
            scoreType === "tetris"
              ? "rgba(229, 170, 49, 1)"
              : "rgba(153, 0, 255, 1)";
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
            fontFamily: "Courier"
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
        backgroundColor: "rgba(229, 170, 49, 1)",
        borderColor: "rgba(229, 170, 49, 1)",
        borderColor: ["rgba(229, 170, 49, 1)", "rgba(153, 0, 255, 1)"],
        datasets: [
          {
            data: [this.tetrisScore, this.regExScore],
            backgroundColor: ["rgba(229, 170, 49, 1)", "rgba(153, 0, 255, 1)"],
          },
        ],
      },
      options: {
        showTooltips: true,
        legend: {
          labels: {
            position: "bottom",
            fontColor: "white",
          },
        },
        title: {
          display: true,
          text: "Your Scores",
          fontSize: 24,
          fontColor: "white",
          fontFamily: "Courier"
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
      .text(600, 100, `good job ${this.alias}!`, {
        fontSize: "24px",
        fontFamily: "retroFont",
        align: "center",
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(600, 140, `Final Score: ${this.tetrisScore + this.regExScore}`, {
        fontSize: "20px",
        fontFamily: "retroFont",
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(600, 180, `Press enter to go back to the menu!`, {
        fontSize: "24px",
        fontFamily: "retroFont",
      })
      .setOrigin(0.5, 0.5);

    //displays the title
    this.title = this.add.sprite(600, 35, "title").setScale(0.2).setDepth(11);

    //displays the doughnut chart
    this.rexUI.add.chart(600, 400, 200, 100, gameScore).resize(300, 300);

    // display option for in depth charts
    this.add
      .text(600, 650, "Press shift to see more charts!", {
        fontSize: "24px",
        fontFamily: "retroFont",
      })
      .setOrigin(0.5, 0.5);
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.enter)) {
      this.scorePosted = false;
      store.dispatch(clearPlayerData());
      this.scene.start("MenuScene");
    } else if (Phaser.Input.Keyboard.JustUp(this.shift)) {
      this.scene.start("DetailedScoreScene");
    }
  }
}
