const { defineConfig } = require('@vue/cli-service')
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = process.env.VUE_APP_TITLE || '咸蛋管理平台'

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = name
        return args
      })

    // svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icon'))
      .end()

    config.module
      .rule('icon')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]'
      })
      .end()
  },
  // webpack-dev-server 相关配置
  devServer: {
    port: 8080, // 端口号，被占用自动提升加1
    https: false, // 协议
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // 获取生产环境设置的变量，属性名是变量，需要通过[]包裹,后期便于维护
        target: process.env.VUE_APP_SERVICE_URI, // 开发环境的接口地址
        changOrigin: true, // 允许开启代理，创建虚拟服务端
        logLevel: 'debug',
        pathRewrite: {
          // 匹配以dev-spi开头的设置为空
          // "^/dev-api":""，
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  css: {
    extract: false,
    loaderOptions: {
      scss: {
        // 全局引入变量和 mixin
        additionalData: '@import "./src/styles/variable.scss";'
      }
    }
  },
  runtimeCompiler: true,
  parallel: true,
  // 如果不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@utils': resolve('utils'),
        '@theme': resolve('theme')
      }
    }
  }
})
