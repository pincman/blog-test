module.exports = {
    apps: [
        {
            name: 'forum',
            script: './main.js',
            watch: true,
            ignore_watch: ['node_modules'],
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
