const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/moha-api',
    createProxyMiddleware({
      target: 'https://10.10.6.15',
      changeOrigin: true,
      secure: false,
    })
  );
};