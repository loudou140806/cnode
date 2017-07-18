const webpack = require('webpack');
const path = __dirname + '/dist';

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
        filename: '[name].js',
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