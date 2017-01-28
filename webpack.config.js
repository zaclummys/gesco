/* global __dirname */

const path = require('path');

module.exports = {
    'gesco': {
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'gesco.js',
            library: 'Gesco',
            libraryTarget: 'umd',
        },
        progress: false,
        module: {
            loaders: [
                {
                    test: /.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015']
                    }
                }
            ]
        }
    }
};