'use strict';

var autoprefixer = require('autoprefixer');
var os = require('os');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
var getClientEnvironment = require('./env');
var paths = require('./paths');
var AutoMergeJs = require('../scripts/autoMergeJs');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});
const CopyWebpackPlugin = require('copy-webpack-plugin');


var publicPath = '/';
var publicUrl = '';
var env = getClientEnvironment(publicUrl);

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: [
        require.resolve('react-dev-utils/webpackHotDevClient'),
        require.resolve('./polyfills'),
        paths.appIndexJs
    ],
    output: {
        path: paths.appBuild,
        pathinfo: true,
        filename: 'static/js/bundle.js',
        publicPath: publicPath
    },
    resolve: {
        fallback: paths.nodePaths,
        extensions: ['.js', '.json', '.jsx', ''],
        alias: {
            'react-native': 'react-native-web',
            "@": `${__dirname}/../src`,
        }
    },

    module: {
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint',
                include: paths.appSrc,
            }
        ],
        loaders: [
            {
                exclude: [
                    /\.html$/,
                    /\.(js|jsx)(\?.*)?$/,
                    /\.(css|less)$/,
                    /\.json$/,
                    /\.svg$/
                ],
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(js|jsx)$/,
                include: paths.appSrc,
                loader: 'happypack/loader?id=js'
            },
            {
                test: /\.css$/,
                loader: 'happypack/loader?id=css'
            },
            {
                test: /\.less$/,
                loader: 'happypack/loader?id=less'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.svg$/,
                loader: 'file',
                query: {
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            }
        ]
    },

    postcss: function () {
        return [
            autoprefixer({
                browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9',
                ]
            }),
        ];
    },
    plugins: [
        new InterpolateHtmlPlugin(env.raw),
        new AutoMergeJs(),
        new HappyPack({
            id: "js",
            loaders: ['react-hot', 'babel?presets[]=react-app,plugins[]=transform-runtime,plugins[]=transform-decorators-legacy'],
            threadPool: happyThreadPool,
        }),
        new HappyPack({
            id: "less",
            loaders: ['style-loader!css-loader!less-loader'],
            threadPool: happyThreadPool,
        }),
        new HappyPack({
            id: "css",
            loaders: ['style!css?importLoaders=1!postcss'],
            threadPool: happyThreadPool,
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
        }),
        new CopyWebpackPlugin([
            {
                from: 'node_modules/monaco-editor/min/vs',
                to: 'vs',
            }
        ]),
        new webpack.DefinePlugin(env.stringified),
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
        new WatchMissingNodeModulesPlugin(paths.appNodeModules)
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
