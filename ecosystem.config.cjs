module.exports = {
  apps: [
    {
      name: "confeitaria-api",
      cwd: "./apps/api",
      script: "dist/main.js",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "confeitaria-web",
      cwd: "./apps/web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 4222",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "questions-api",
      cwd: "./apps/questions",
      script: "dist/main.js",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
