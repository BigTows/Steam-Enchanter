const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new FileManagerPlugin({
            events: {
                onEnd: {
                    delete: ['./build'],
                    archive: [
                        {
                            source: './dist', destination: `./build/${process.env.npm_package_name}-${process.env.npm_package_version}.zip`,
                            format: 'zip',
                            options: {
                                gzip: true,
                                gzipOptions: {
                                    level: 1,
                                },
                                globOptions: {
                                    // https://github.com/Yqnn/node-readdir-glob#options
                                    dot: true,
                                },
                            },
                        },
                        {
                            source: './src', destination: `./build/${process.env.npm_package_name}-${process.env.npm_package_version}-source.zip`,
                            format: 'zip',
                            options: {
                                gzip: true,
                                gzipOptions: {
                                    level: 1,
                                },
                                globOptions: {
                                    // https://github.com/Yqnn/node-readdir-glob#options
                                    dot: true,
                                },
                            },
                        },
                    ],
                },
            },
        }),
    ]
});