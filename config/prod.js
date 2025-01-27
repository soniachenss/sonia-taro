export default {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {},
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        },
        // 小程序端样式引用本地资源内联配置
        url: {
          enable: true,
          config: {
            limit: 1024000 // 文件大小限制
          }
        }
      }
    }
  },
    mini: {
      webpackChain: (chain, webpack) => {
        chain.merge({
          plugin: {
            install: {
              plugin: require('terser-webpack-plugin'),
              args: [{
                terserOptions: {
                  compress: true, // 默认使用terser压缩
                  // mangle: false,
                  keep_classnames: true, // 不改变class名称
                  keep_fnames: true, // 不改变函数名称
                },
              }, ],
            },
          },
        })
      },
    },
}
