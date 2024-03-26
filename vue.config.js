const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 8000,
    proxy: {
      '/foo': {
        target: 'http://localhost:7000',
        pathRewrite: { '^/foo': '' }, //代理往后端的服务器请求去掉以api开头的前缀
        ws: true,
        changeOrigin: true,
      },
    },
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
    } else {
      // 为开发环境修改配置...
      config.mode = 'development'
    }
  },
})
