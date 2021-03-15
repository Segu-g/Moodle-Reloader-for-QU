const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * @type import("webpack").Configuration
 */
module.exports = {
    mode: process.env.NODE_ENV || "development",
    devtool: "inline-source-map",
    watchOptions: {
        ignored: /node_modules/
    },
    devServer: {
        contentBase: path.join(__dirname, 'static'),
        open: true,
        port: 8082,
    },
    entry: {
        "content/content": path.join(__dirname, 'src/content_script.tsx'),
        "event/event": path.join(__dirname, 'src/event.tsx'),
        "options/options": path.join(__dirname, 'src/option/options.tsx'),
        "popup/popup": path.join(__dirname, "src/popup.tsx")
    },
    output: {
        // 出力するファイル名
        filename: '[name].bundle.js',
        // 出力先のパス（絶対パスを指定する必要がある）
        path: path.join(__dirname, 'dist/')
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'url-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: true,
                            modules: true,
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: false,
                            },
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js",".css", ".scss"]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns:[
                {
                    from: "./public",
                    to: "."
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: "[name]_style.css",
        })
    ]
}