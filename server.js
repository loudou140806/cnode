var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");

var server = new webpackDevServer(webpack(config), {
    hot: true,
    publicPath: config.output.publicPath,
    proxy: {
        "/api/*": {
            target: 'http://www.cnode.org/api',
            secure: false
        }
    },
    stats: {
        colors: true
    }
})

server.listen(8080);