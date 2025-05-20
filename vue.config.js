const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  // 添加处理规则，只处理根目录的 index.html
  pages: {
    index: {
      // 入口
      entry: 'src/main.js',
      // 模板
      template: 'public/index.html',
      // 输出文件
      filename: 'index.html',
      // 标题
      title: '教学平台'
    }
  },
  // 静态资源处理
  chainWebpack: config => {
    // 处理 teacher 和 student 目录中的 HTML 文件
    config.plugin('copy')
      .use(require('copy-webpack-plugin'), [{
        patterns: [
          {
            from: 'public/teacher',
            to: 'teacher'
          },
          {
            from: 'public/student',
            to: 'student'
          }
        ]
      }])

    // 图片压缩配置
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb的图片会被base64内联
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]'
          }
        }
      })

    // 开启资源压缩
    config.optimization
      .minimize(true)
      .splitChunks({
        chunks: 'all',
        minSize: 20000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      })
  },
  // 添加代理配置
  devServer: {
    proxy: {
      '/api': {
        target: 'https://www.wsqzwky234.cn',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
