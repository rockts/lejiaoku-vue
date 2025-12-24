module.exports = {
  lintOnSave: false,
  transpileDependencies: ['vue-router'],
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3000',
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
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .include.add(/node_modules/).end()
      .type('javascript/auto');
  },
};
