module.exports = {
  lintOnSave: false,
  // 移除 transpileDependencies，避免 vue-router 的 .mjs 文件被 babel 处理
  // transpileDependencies: ['vue-router'],
  // 生产环境关闭 Source Map（减小文件大小，提高安全性）
  productionSourceMap: false,
  // 生产环境公共路径（如果使用 CDN，可以配置 CDN 地址）
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    port: 8080,
    // 配置 historyApiFallback，确保前端路由返回 index.html
    historyApiFallback: {
      disableDotRule: true,
      // 所有路径都返回 index.html，让 Vue Router 处理
      // 注意：API 路径和静态资源路径会被代理处理，不会到这里
      rewrites: [
        { from: /./, to: '/index.html' }
      ]
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
      '/user': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        // /user 路径只代理 API 请求，浏览器直接访问返回 index.html
        bypass: function (req, res, proxyOptions) {
          const acceptHeader = req.headers.accept || '';
          const isXHR = req.headers['x-requested-with'] === 'XMLHttpRequest';
          const isJSON = acceptHeader.indexOf('application/json') !== -1;
          const isHTML = acceptHeader.indexOf('text/html') !== -1;

          if (isHTML && !isXHR && !isJSON) {
            return '/index.html';
          }

          if (isJSON || isXHR) {
            return null; // 代理到后端
          }

          return '/index.html';
        },
      },
      // 配置 /users 代理，但只代理 API 请求（带 Accept: application/json）
      // 浏览器直接访问会返回 index.html，由 Vue Router 处理
      '/users': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        bypass: function (req, res, proxyOptions) {
          // 检查是否是 API 请求
          const acceptHeader = req.headers.accept || '';
          const isXHR = req.headers['x-requested-with'] === 'XMLHttpRequest';
          const isJSON = acceptHeader.indexOf('application/json') !== -1;
          const isHTML = acceptHeader.indexOf('text/html') !== -1;

          // 如果是 HTML 请求（浏览器直接访问），返回 index.html
          if (isHTML && !isXHR && !isJSON) {
            return '/index.html';
          }

          // 只有 API 请求（JSON 或 XHR）才代理到后端
          if (isJSON || isXHR) {
            return null; // 代理到后端
          }

          // 默认：返回 index.html（浏览器直接访问的情况）
          return '/index.html';
        },
      },
      '/my': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        // /my 路径只代理 API 请求，浏览器直接访问返回 index.html
        bypass: function (req, res, proxyOptions) {
          const acceptHeader = req.headers.accept || '';
          const isXHR = req.headers['x-requested-with'] === 'XMLHttpRequest';
          const isJSON = acceptHeader.indexOf('application/json') !== -1;
          const isHTML = acceptHeader.indexOf('text/html') !== -1;

          if (isHTML && !isXHR && !isJSON) {
            return '/index.html';
          }

          if (isJSON || isXHR) {
            return null; // 代理到后端
          }

          return '/index.html';
        },
      },
      '/uploads': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        // /uploads 路径始终代理到后端，不经过 historyApiFallback
        bypass: function (req, res, proxyOptions) {
          // 始终代理，不检查 Accept 头
          return null;
        },
      },
      '/upload': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
      '/files': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    try {
      config.plugins.delete('fork-ts-checker');
      config.plugins.delete('eslint');
    } catch (e) { }

    // 配置处理 .mjs 文件
    // webpack 4 需要让 .mjs 文件也通过 babel-loader 处理（支持可选链等 ES6+ 语法）
    // 移除 js 规则对 .mjs 的排除，让 .mjs 文件也走 babel-loader
    // 但需要确保 babel 配置支持这些语法
    const jsRule = config.module.rule('js');
    if (jsRule) {
      // 移除对 .mjs 的排除，让它们也通过 babel-loader 处理
      // jsRule.exclude 可能已经包含了 node_modules，需要确保 .mjs 不被排除
    }

    // 为 .mjs 文件添加专门的规则，使用 babel-loader
    // 使用全局 babel 配置（babel.config.js），它已经包含了可选链插件
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .include.add(/node_modules/).end()
      .use('babel-loader')
      .loader('babel-loader');
  },
};
