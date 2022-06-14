const { ProvidePlugin } = require('webpack');

module.exports = function (config, env) {
    return {
        ...config,
        plugins: [
            ...config.plugins,
            new ProvidePlugin({
                process: 'process/browser',
            }),
        ],
        resolve: {
            ...config.resolve,
            fallback: {
                assert: require.resolve('assert'),
                buffer: require.resolve('buffer'),
                http: require.resolve("stream-http"),
                https: require.resolve("https-browserify"),
                os: require.resolve("os-browserify"),
                url: require.resolve("url"),
                stream: require.resolve('stream-browserify'),
            },
        },
        ignoreWarnings: [/Failed to parse source map/],
    };
};
