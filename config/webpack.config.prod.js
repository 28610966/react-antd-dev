'use strict';

var autoprefixer = require('autoprefixer');
var os = require('os');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var paths = require('./paths');
var getClientEnvironment = require('./env');
var autoMergeJs = require('../scripts/autoMergeJs');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});

var publicPath = paths.servedPath;
var shouldUseRelativeAssetPaths = publicPath === './';
var publicUrl = publicPath.slice(0, -1);
var env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
    throw new Error('Production builds must have NODE_ENV=production.');
}

const cssFilename = 'static/css/[name].[contenthash:8].css';

const extractTextPluginOptions = shouldUseRelativeAssetPaths
    ? {publicPath: Array(cssFilename.split('/').length).join('../')}
    : undefined;

module.exports = {
    bail: true,
    devtool: 'source-map',
    entry: [
        require.resolve('./polyfills'),
        paths.appIndexJs
    ],
    output: {
        path: paths.appBuild,
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
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
                include: paths.appSrc
            }
        ],
        loaders: [
            {
                exclude: [
                    /\.html$/,
                    /\.(js|jsx)$/,
                    /\.css$/,
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
                loader: 'happypack/loader?id=js',

            },
            {
                test: /\.(css|less)$/,
                loader: ExtractTextPlugin.extract(
                    'style',
                    'css?importLoaders=1!postcss!less-loader',
                    extractTextPluginOptions
                )
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
        new autoMergeJs(),
        new HappyPack({
            id: "js",
            loaders: ['babel?presets[]=react-app,plugins[]=transform-runtime,plugins[]=transform-decorators-legacy'],
            threadPool: happyThreadPool,
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        new webpack.DefinePlugin(env.stringified),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true,
                warnings: false
            },
            mangle: {
                screw_ie8: true
            },
            output: {
                comments: false,
                screw_ie8: true
            }
        }),
        new ExtractTextPlugin(cssFilename),
        new ManifestPlugin({
            fileName: 'asset-manifest.json'
        })
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
