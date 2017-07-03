var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");

var server = new webpackDevServer(webpack(config), {
    hot: true,
    publicPath: config.output.publicPath,
    proxy: {
        "/api/*": {
            target: 'https://cnodejs.org/',
            secure: false
        }
    },
    stats: {
        colors: true
    }
})

//将其他路由，全部返回index.html
server.app.get('*', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

server.listen(8080);