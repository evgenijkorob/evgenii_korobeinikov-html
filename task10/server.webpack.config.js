const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/server/server.ts',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, './prod/server/')
  },
  optimization: {
    noEmitOnErrors: true
  },
  target: "node",
  node: {
    __dirname: false
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.server.json',
              context: __dirname
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  }
};
