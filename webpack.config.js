const base = require('./webpack/base');
const prod = require('./webpack/prod');

if (process.env.NODE_ENV === 'development') {
  module.exports = base;
} else {
  module.exports = prod;
}
