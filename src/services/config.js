let baseUrlPrefix = ''
const env = process.env.NODE_ENV === 'development' ? 'development' : 'production'
console.log('编译环境：',process.env.NODE_ENV)
switch (env) {
  case 'development':
    baseUrlPrefix = 'https://app121179.eapps.dingtalkcloud.com/'
    break
  case 'production':
    baseUrlPrefix = 'https://app121179.eapps.dingtalkcloud.com/'
    break
}

const api = {
  baseUrl: baseUrlPrefix,
}

export default api