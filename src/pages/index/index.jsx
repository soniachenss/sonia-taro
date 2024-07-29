import { Suspense } from 'react'
import { View } from '@tarojs/components'
import Taro, {  useLoad } from '@tarojs/taro' // onLoad -> componentWillMount
import { Button, Toast, Skeleton } from "@taroify/core"
import { useDispatch } from 'react-redux'
import './index.scss'
import {
    appLogin,
    getLoginPhone,
} from '@/reducers/home/action'

export default function Index() {

  const dispatch = useDispatch()
  
  useLoad(() => {
    dispatch(appLogin(() => {
        Taro.switchTab({
            url: `/pages/shop/index`
        })
    },()=>{
        Taro.showModal({
            title: '登录失败',
            content: '未获取到小程序登录权限，请联系信息管理员添加',
            
        })
    }))
  })
  const handleGetPhoneNumber = (e) => {
      
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 用户同意授权
      
      dispatch(getLoginPhone({code: e.detail.code},()=>{
        Taro.showModal({
            title: '提示',
            content: '未获取到小程序登录权限，请联系信息管理员添加',
            
        })
      }))
    } else {
      // 用户拒绝授权
      Taro.showModal({
        title: '提示',
        content: '获取手机号失败',
        
      })
    }
  }
//   const openId = getStorageSync('openid') 
  return (
      <Suspense fallback={<Skeleton animation="wave" />}>
            <View className='ys-login'>
                <Toast id="toast" duration='2000' />
            <Button openType="getPhoneNumber" onGetPhoneNumber={handleGetPhoneNumber} color="success">微信用户快捷登录</Button>
            
            </View>
      </Suspense>
    
  )
}
