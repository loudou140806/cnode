var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');

var publicPath = '/dist';
var path = __dirname + '/dist'

var plugin = [];

if (process.argv.indexOf('-p') > -1) { //生产环境
    plugin.push(new webpack.DefinePlugin({ //编译成生产版本
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }));
    publicPath = '/cnode/dist/';
    path = __dirname + '/cnode/dist/';
}

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
                test: /\.css$/,
                exclude: /^node_modules$/,
			    use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader',
                        options: {
                            modules: false,
                            // localIdentName: '[name]-[local]',
                        } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [autoprefixer];
                            },
                        },
                    }
                ]
            },{
            test: /\.less?$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader',
                    options: {
                        modules: false,
                        // localIdentName: '[name]-[local]',
                    } },
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins() {
                            return [autoprefixer];
                        },
                    },
                },
                { loader: 'less-loader' },
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
            },{
                test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
                exclude: /^node_modules$/,
			      use: [
			      	{
					      loader: "file-loader",
					      options: {
					      	name: '[name].[ext]'
					      }
				      }
			      	]
			      // loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },
    plugins: plugin,
    resolve: {
        extensions: ['.js', '.jsx', 'css', 'scss'], //后缀名自动补全
    }
}