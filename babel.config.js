'use strict';
/**
 babel.config.js with useful plugins.
 */
module.exports = function (api) {
    api.cache(true);

    const presets = ['@babel/preset-env', '@babel/preset-typescript'];
    const plugins = [
        '@babel/plugin-transform-runtime',
        [
            '@babel/plugin-proposal-decorators',
            {
                version: 'legacy',
            },
        ],
        [
            '@babel/plugin-proposal-class-properties',
            {
                loose: true,
            },
        ],
        [
            '@babel/plugin-proposal-private-property-in-object',
            {
                loose: true,
            },
        ],
        [
            '@babel/plugin-transform-private-methods',
            {
                loose: true,
            },
        ],
        // [
        //     '@babel/plugin-proposal-private-methods',
        //     {
        //         loose: true,
        //     },
        // ],
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    '@Commons': './src/Common',
                    '@Servers': './src/Server',
                    '@Routes': './src/Route',
                    '@Controllers': './src/Http/Controller',
                    '@Middlewares': './src/Http/Middlewares',
                    '@Providers': './src/Http/Providers',
                    '@Repositories': './src/Http/Repositories',
                    '@Services': './src/Http/Services',
                    '@Config': './src/Common/Config',
                    '@Logger': './src/Common/Logger',
                    '@Helper': './src/Common/Helper',
                    '@Messages': './src/Common/Messages',
                    '@Const': './src/Common/Const',
                    '@Codes': './src/Common/Codes',
                    '@TokenManager': './src/Common/TokenManager',
                    '@Types': './src/Types',
                    '@Database': './src/Database',
                    '@Entity': './src/Database/Entities',
                    '@Service': './src/Database/Service',
                },
            },
        ],
        'source-map-support',
    ];

    return {
        presets,
        plugins,
    };
};
