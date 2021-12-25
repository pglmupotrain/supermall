module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        //'@': '/src',
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
        }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'supermall'
      return args
    })
  }
}
