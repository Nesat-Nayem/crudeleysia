module.exports = {
  apps: [{
    name: 'elysia-user-crud',
    script: 'bun',
    args: 'run src/index.ts',
    cwd: '/var/www/biov2.atpuae.com',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 2040,
      APP_PORT: 2040
    },
    error_file: '/var/log/pm2/elysia-user-crud-error.log',
    out_file: '/var/log/pm2/elysia-user-crud-out.log',
    log_file: '/var/log/pm2/elysia-user-crud.log'
  }]
};
