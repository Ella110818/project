const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
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
  },
  // 添加代理配置
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,
        logLevel: 'debug',
        pathRewrite: { '^/api': '/api' }
      }
    }
  }
})
