var path = require('path');
var webpack = require('webpack');

var ROOT_PATH = path.resolve(__dirname);
var ENTRY_PATH = path.resolve(ROOT_PATH);
var OUTPUT_PATH = path.resolve(ROOT_PATH, 'public/dist/');

var system = {
    entry: {
        system: path.resolve(ENTRY_PATH, 'src/index.js')
    },
    output: {
        path: OUTPUT_PATH,
        filename: '[name].js',
    },
    node: {
        net: 'empty',
        fs:'empty'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx|.js?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', "react", "es2015"],
                    }
                },
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },]
    }
}

module.exports = system;
