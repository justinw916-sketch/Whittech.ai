module.exports = {
    apps: [{
        name: "whittech-app",
        script: "./server.js",
        env: {
            PORT: 3000,
            NODE_ENV: "production",
        }
    }]
}
