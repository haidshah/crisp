module.exports = {
  apps: [
    {
      name: 'crisp-cleaners-crm',
      script: './app.cjs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
