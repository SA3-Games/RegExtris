import store from '../store';

export default class DetailedScoreScene extends Phaser.Scene {
  constructor() {
    super('DetailedScoreScene');
  }

  preload() {
    this.load.image('title', 'assets/spritesheets/REGEXTRISbw2.png');
  }
  create() {
    this.enter = this.input.keyboard.addKey('ENTER');
    this.shift = this.input.keyboard.addKey('SHIFT');

    // Displays the title sprite
    this.title = this.add.sprite(600, 35, 'title').setScale(0.2).setDepth(11);

    //We get the redux state here and specifically get all the scores of the player as well as the ratios of the characters cleared for use in the graphs that follow
    this.reduxState = store.getState();
    this.scores = this.reduxState.score;
    this.ratios = this.reduxState.ratios;

    //Extract the characters cleared as well as the regex characters cleared from Ratios
    this.unmatched = this.ratios.unmatched;
    this.matched = this.ratios.matched;

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
      type: 'line',
      data: {
        labels: this.gameNum,
        datasets: [
          {
            label: 'Tetris',
            backgroundColor: 'rgba(229, 170, 49, 1)',
            borderColor: 'rgba(229, 170, 49, 1)',
            data: this.onlyTetrisScores,
            fill: false,
          },
          {
            label: 'Regex',
            fill: false,
            backgroundColor: 'rgba(153, 0, 255, 1)',
            borderColor: 'rgba(153, 0, 255, 1)',
            data: this.onlyRegexScores,
          },
        ],
      },
      options: {
        legend: {
          labels: {
            fontColor: 'white',
          },
        },
        title: {
          display: true,
          text: 'Player Score History',
          fontSize: 24,
          fontColor: 'white',
          fontFamily: 'Courier',
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: false,
                fontColor: 'white',
                fontSize: 10,
              },
              scaleLabel: {
                display: true,
                labelString: 'Games Played',
                fontColor: 'white',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                display: true,
                beginAtZero: true,
                fontColor: 'white',
                fontSize: 10,
              },
              scaleLabel: {
                display: true,
                labelString: 'Scores',
                fontColor: 'white',
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

    this.labels = new Array(this.unmatched.length);
    this.labels.fill(0);
    //Stacked bar graph that shows you the ratio of the characters you cleared
    this.charRatio = {
      type: 'bar',
      data: {
        labels: this.labels, //# of times you cleared a set of lines
        datasets: [
          {
            label: 'Matched',
            backgroundColor: 'rgba(153, 0, 255, 1)',
            borderColor: 'rgba(153, 0, 255, 1)',
            data: this.matched, //# of characters that were cleraed which turned purple
          },
          {
            label: 'Total',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderColor: 'rgba(255, 255, 255, 1)',
            data: this.unmatched, //# of characters that were cleared which stayed white (umatched)
          },
        ],
      },
      options: {
        legend: {
          labels: {
            fontColor: 'white',
          },
        },
        title: {
          display: true,
          text: 'RegEx Matching Breakdown',
          fontSize: 24,
          fontColor: 'white',
          fontFamily: 'Courier',
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                display: false,
                fontColor: 'white',
                fontSize: 10,
              },
              scaleLabel: {
                display: true,
                labelString: 'Lines',
                fontColor: 'white',
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                display: true,
                beginAtZero: true,
                fontColor: 'white',
                fontSize: 10,
              },
              scaleLabel: {
                display: true,
                labelString: 'Characters Cleared',
                fontColor: 'white',
              },
            },
          ],
        },
      },
    };

    //displays the stacked Bar graph called charRatio
    this.rexUI.add.chart(850, 400, 200, 100, this.charRatio).resize(500, 350);

    // display option to go back to the game over scene
    this.add
      .text(600, 130, 'Press SHIFT to go back!', {
        fontSize: '24px',
        fontFamily: 'retroFont',
      })
      .setOrigin(0.5, 0.5);
  }

  update() {
    if (Phaser.Input.Keyboard.JustUp(this.shift)) {
      this.scene.start('GameOverScene');
    }
  }
}
