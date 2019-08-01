/* eslint-disable no-undef */
const path = require('path');
const glob = require('glob');

let entrys = {};
glob
  .sync(`./src/lambda/handlers/**/*.ts`, {
    ignore: './src/lambda/handlers/**/*.d.ts'
  })
  .map(key => {
    entrys[path.basename(key, '.ts')] = key;
  });
console.log(entrys);
module.exports = {
  entry: entrys,
  target: 'node',
  output: {
    path: path.join(__dirname, '.dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs'
  },
  externals: {
    'aws-sdk': 'aws-sdk',
    'spawn-sync': 'spawn-sync'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
      }
    ]
  }
};
