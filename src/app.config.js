export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/shop/index',
    'pages/stock/index',
    'pages/user/index',
  ],
  subPackages: [{
      root: 'pages/subPages',
      pages: [
        'pages/check/index',
        'pages/manage/index',
        'pages/search/index',
        'pages/addStock/index',
        'pages/order/index',
      ]
  }],
  lazyCodeLoading: "requiredComponents",
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
  },
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: 'pages/shop/index',
        text: '门店'
      },
      {
        pagePath: 'pages/stock/index',
        text: '叫货'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的'
      },
    ]
  }
})
