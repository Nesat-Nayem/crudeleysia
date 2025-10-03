module.exports = {
  apps: [{
    name: 'biov2-api',
    script: 'bun',
    args: 'src/index.ts',
    cwd: '/var/www/biov2',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 2070
    },
    error_file: '/var/log/pm2/biov2-error.log',
    out_file: '/var/log/pm2/biov2-out.log',
    log_file: '/var/log/pm2/biov2-combined.log'
  }]
}
