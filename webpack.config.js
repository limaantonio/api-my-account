const path = require('path');

module.exports = {
  // outras configurações do webpack...

  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      // outras regras de loader podem estar aqui...
    ],
  },

  // outras configurações do webpack...
};
