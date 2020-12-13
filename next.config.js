const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(new DuplicatePackageCheckerPlugin());
            config.resolve.alias['bn.js'] = path.resolve(
                __dirname,
                'node_modules',
                'bn.js'
            );
            config.resolve.alias['inherits'] = path.resolve(
                __dirname,
                'node_modules',
                'inherits'
            );
            config.resolve.alias['readable-stream'] = path.resolve(
                __dirname,
                'node_modules/node-libs-browser/node_modules',
                'readable-stream'
            );
            config.resolve.alias['safe-buffer'] = path.resolve(
                __dirname,
                'node_modules',
                'safe-buffer'
            );
            config.resolve.alias['scheduler'] = path.resolve(
                __dirname,
                'node_modules',
                'scheduler'
            );
            if (process.env.ANALYZE) {
                config.plugins.push(
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'server',
                        analyzerPort: isServer ? 8888 : 8889,
                        openAnalyzer: true,
                    })
                );
            }
            config.optimization = {
                ...config.optimization,
                usedExports: true,
            };
        }
        return config;
    },
};
