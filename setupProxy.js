const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/moha-api',
    createProxyMiddleware({
      target: 'https://192.168.110.15',
      changeOrigin: true,
      secure: false,
    })
  );
};