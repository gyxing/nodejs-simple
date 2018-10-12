var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, "./index.js"),
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "js/[name].bundle.js",
        publicPath: '/'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: [
                {
                    loader: "babel-loader",
                    options: {
                        presets: [["es2015", { modules: false }]],
                        plugins: ["syntax-dynamic-import"]
                    }
                }
            ]
        }]
    },
    node: {
        fs: "empty",
        net: 'empty',
        tls: 'empty'
    }
};