var path = require('path');

module.exports = {
    entry: './src/run.js',
    output: {
        filename: 'todoApp.bundle.js',
        path: path.resolve(__dirname, 'src'),
        pathinfo: true
        // library: {
        //     name: 'TodoApp',
        //     type: 'umd'
        // }
    }, 
    devtool: 'source-map',
    mode: 'development',
    resolve: {
        alias: {
            loki: path.resolve(__dirname, 'src')
        }
    }
};