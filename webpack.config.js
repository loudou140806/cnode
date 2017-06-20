var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');

var publicPath = '/dist';
var path = __dirname + '/dist'

var plugin = [];

plugin.push(new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
}));

plugin.push(new htmlWebpackPlugin({
    filename: '../index.html', //生成的html存放路径，相对于 path
    template: './src/template/index.html', //html模板路径
    hash: true,    //为静态资源生成hash值
}))

plugin.push(new webpack.HotModuleReplacementPlugin());

module.exports = {
    entry: {
        app: ['./src/index']
    },
    output: {
        path,
        publicPath,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /^node_modules$/,
	            use: [
		            {
			            loader: "babel-loader",
			            options: {
				            presets: ['react', 'es2015'],
				            compact: 'false',
				            plugins: ['syntax-dynamic-import']
			            }
		            }
	            ]
            },{
            test: /\.scss?$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: '[name]-[local]',
                    } },
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins() {
                            return [autoprefixer];
                        },
                    },
                },
                { loader: 'sass-loader' },
            ],
        },{
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: './images/[name].[ext]',
                        },
                    },
                ],
            },
        ]
    },
    plugins: plugin,
    resolve: {
        extensions: ['.js', '.jsx', 'css', 'scss'], //后缀名自动补全
    }
}