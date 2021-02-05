'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
console.log(this,process.env.type)
module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/ErpScan/HttpRequestSkill.ashx': {
        target: 'http://192.168.35.231/QYWX/project/ErpScan',
        changeOrigin: true,
        pathRewrite: {
          '^/ErpScan/HttpRequestSkill.ashx': '/HttpRequestSkill.ashx',
        }
      },
      '/ErpScan10/HttpRequestSkill.ashx': {
        target: 'http://tm.lilanz.com/oa/project/ErpScan',
        changeOrigin: true,
        pathRewrite: {
          '^/ErpScan10/HttpRequestSkill.ashx': '/HttpRequestSkill.ashx',
        }
      },      
      '/ErpScan/HttpRequestSkillFile.ashx': {
        target: 'http://192.168.35.231/QYWX/project/ErpScan',
        changeOrigin: true,
        pathRewrite: {
          '^/ErpScan/HttpRequestSkillFile.ashx': '/HttpRequestSkillFile.ashx',
        }
      },
      '/MobileScan/checkScan.ashx': {
        // target : 'http://192.168.35.231/QYWX/project/MobileScan',
        target: 'http://tm.lilanz.com/oa/project/MobileScan',
        changeOrigin: true,
        pathRewrite: {
          '^/MobileScan/checkScan.ashx': '/checkScan.ashx',
        }
      }
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST localhost
    disableHostCheck: true,
    port: 9091, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
