module.exports = {
  apps: [{
    name: 'frolens',
    script: 'node_modules/.bin/next',
    args: 'start -p 3000',
    cwd: '/var/www/frolens',
    env: { NODE_ENV: 'production' },
    max_memory_restart: '512M',
  }],
};
