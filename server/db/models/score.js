const Sequelize = require('sequelize');
const db = require('../db');

const Score = db.define('score', {
  tetrisScore: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  regExScore: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

/**
 * Class method for creating a histogram using all available scores.
 * returns: {
 * regexBins, regexFreqs, tetrisBins, tetrisFreq
 * }
 */
Score.makeHistogram = async function () {
  const scores = await this.findAll({
    attributes: ['tetrisScore', 'regExScore'],
  });
  let regexArr = [];
  let tetrisArr = [];
  scores.map((score) => {
    regexArr.push(score.dataValues.regExScore);
    tetrisArr.push(score.dataValues.tetrisScore);
  });
  const { bins: regexBins, frequencies: regexFreqs } = calculate(regexArr, 12);
  const { bins: tetrisBins, frequencies: tetrisFreqs } = calculate(
    tetrisArr,
    12
  );

  return { regexBins, regexFreqs, tetrisBins, tetrisFreqs };
};

/**
 * Calculates the size of each bin and the frequency for  creating a histogram.
 * Returns {bins: array, frequencies: array}
 * */
function calculate(scoreArr, numBins) {
  const maxScore = Math.max(...scoreArr);
  // size of the bin is the maximum score / number of bins
  const binSize = Math.floor(maxScore / numBins);
  let bins = [];
  let frequencies = new Array(12);
  frequencies.fill(0);

  for (let i = 0; i < numBins; i++) {
    bins.push(i * binSize);
  }
  scoreArr.forEach((score) => {
    let indexFreq = Math.floor(score / binSize);
    if (score % binSize === 0 || score > binSize * 12) {
      indexFreq -= 1;
    }
    frequencies[indexFreq] += 1;
  });
  return { bins, frequencies };
}

module.exports = Score;
