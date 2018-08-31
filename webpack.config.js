var config = {
  entry: './main.js',
  output: {
    path: '/',
    filename: 'index.js',
  },
  devServer: {
    inline: true,
    host: '0.0.0.0',
    port: 8080,
    historyApiFallback: true

  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }
    ]
  }
}
module.exports = config;
