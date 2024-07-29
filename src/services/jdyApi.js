import Taro from '@tarojs/taro'
import { logError } from '@/utils/error'
import {  HTTP_STATUS } from '@/utils/status'

const token = ''

export default {
  baseOptions(params, method = 'GET') {
    let { url, data } = params
    // let token = Taro.getStorageSync('TOKEN')
    // if (!token) login()
    // let contentType = 'application/x-www-form-urlencoded'
    let contentType = 'application/json'
    contentType = params.contentType || contentType
    const option = {
      isShowLoading: false,
      loadingText: '正在加载',
      url: 'https://api.jiandaoyun.com/api/v5/app/' + url,
      data: data,
      method: method,
      header: { 
          'content-type': contentType, 
          'token': token,
          "Authorization":"Bearer UMiYylremy85lugOJLiTPGHyvvhWse0J"
      },
      success(res) {
        if (res.data.code === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.data.code === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.data.code === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        }else if(res.data.code === HTTP_STATUS.IP_DISABLED){
            return logError('api', '白名单限制')
        } else if (res.data.code === HTTP_STATUS.SUCCESS) {
          return res.data
        }
      },
      error(e) {
        logError('api', '请求接口出现问题', e)
      }
    }
    return Taro.request(option)
  },
  get(url, data = '') {
    let option = { url, data }
    return this.baseOptions(option)
  },
  post: function (url, data, contentType) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  }
}
