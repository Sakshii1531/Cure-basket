// PM2 process manager config — run with:  pm2 start ecosystem.config.js
//
// Cluster mode forks one worker per CPU core (KVM4 = 4 cores), so the API can
// use the whole box instead of a single core. PM2 also auto-restarts a worker
// if it crashes (e.g. on an unhandled rejection), and the other workers keep
// serving in the meantime. Env vars are read from server/.env by the app's own
// dotenv.config(), so they are NOT duplicated here.
module.exports = {
  apps: [
    {
      name: 'curebasket-backend',
      script: 'src/index.js',
      cwd: __dirname,
      instances: 'max',          // one worker per CPU core; set a number to cap it
      exec_mode: 'cluster',
      max_memory_restart: '600M', // restart a worker if it leaks past 600 MB
      autorestart: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
