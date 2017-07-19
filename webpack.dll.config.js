const webpack = require('webpack');
const path = process.argv.indexOf('-p') > -1 ? __dirname + '/cnode/dist' : __dirname + '/dist';

const vendors = [
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-dom',
    'redux',
];

module.exports = {
    entry: {
        lib: vendors
    },
    output: {
        path,
        filename: 'dll.[name].js',
        library: '[name]',
    },
    
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        }),
    ],
};