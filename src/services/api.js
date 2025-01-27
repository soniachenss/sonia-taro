import Taro from '@tarojs/taro'
import { logError } from '@/utils/error'
import {  HTTP_STATUS } from '@/utils/status'
import apiConfig from './config'

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
      url: apiConfig.baseUrl + url,
      data: data,
      method: method,
      header: { 'content-type': contentType, 'token': token },
      success(res) {
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
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
