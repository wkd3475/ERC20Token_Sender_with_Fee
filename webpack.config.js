const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: 'development',
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, 'dist')   
  },
  plugins: [   
    new webpack.DefinePlugin({
      TOKEN_ADDRESS: JSON.stringify(fs.readFileSync('tokenAddress', 'utf8').replace(/\n|\r/g, "")),
      TOKEN_ABI: fs.existsSync('tokenABI') && fs.readFileSync('tokenABI', 'utf8'),
      LOGIC_ADDRESS: JSON.stringify(fs.readFileSync('logicAddress', 'utf8').replace(/\n|\r/g, "")),
      LOGIC_ABI: fs.existsSync('logicABI') && fs.readFileSync('logicABI', 'utf8'),
      PROXY_STORAGE_ADDRESS: JSON.stringify(fs.readFileSync('proxyStorageAddress', 'utf8').replace(/\n|\r/g, "")),
      PROXY_STORAGE_ABI: fs.existsSync('proxyStorageABI') && fs.readFileSync('proxyStorageABI', 'utf8'),
      PROXY_ADDRESS: JSON.stringify(fs.readFileSync('proxyAddress', 'utf8').replace(/\n|\r/g, "")),
      PROXY_ABI: fs.existsSync('proxyABI') && fs.readFileSync('proxyABI', 'utf8'),
    }),
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html"}])
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true }
}