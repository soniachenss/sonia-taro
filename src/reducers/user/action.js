import * as ActionTypes from './ActionTypes';
import api from '@/services/api'
import jdyApi from '@/services/jdyApi'
import Taro, { getStorageSync } from '@tarojs/taro'
// import { Toast } from "@taroify/core"
import {
    YS_APP_ID,
    YS_USER_TABLE_ID,
    YS_SHOP_TABLE_ID,
} from '@/services/Limit.js'
// 获取用户表
export const getAdminInfo = (resolve) => (dispatch,getState) => {
    Taro.showLoading({
        title: '加载中',
    })
    jdyApi.post('entry/data/list',{
        app_id: YS_APP_ID,
        entry_id: YS_USER_TABLE_ID,
        filter: {
            rel: 'and',
            cond: [
            //     {
            //     "field": "is_admin",
            //     "method": "eq",
            //     "value": "是"
            // },
            {
                "field": "can_use",
                "method": "eq",
                "value": "是"
            }
            ]
        },
        limit: 100,
        
    }).then((res) => {
        Taro.hideLoading()
        const resData = res.data
        const openId = getStorageSync('openid')
        const adminList = resData.data.filter(item => item.is_admin === '是')
        const userInfo = resData.data.filter(item => item.wechat_open_id === openId)

        dispatch({
            type: ActionTypes.YS_GET_ADMIN_INFO,
            data: adminList || []
        })
        dispatch({
            type: ActionTypes.YS_CHANGE_USER_INFO,
            userInfo: userInfo[0] || {}
        })
        const homeState = getState().homeState
        dispatch(getShopList({
            isAdmin: userInfo[0]?.is_admin === '是',
            userShopList: homeState.userShopList,
        },resolve))

    })
}
// 获取门店表
export const getShopList = (parmars,resolve) => dispatch => {
    const {
        isAdmin,
        userShopList = [],
        from,
    } = parmars
    Taro.showLoading({
        title: '加载中',
    })
    let cond = [
        {
            "field": "can_use",
            "method": "eq",
            "value": "是"
        }
    ]
    if(!isAdmin){
        const filterCon = userShopList.map(item => {
            return {
                "field": "self_entity_id",
                "method": "eq",
                "value": item.self_entity_id
            }
        })
        cond = cond.concat(filterCon) 
    }
    jdyApi.post('entry/data/list',{
        app_id: YS_APP_ID,
        entry_id: YS_SHOP_TABLE_ID,
        filter: {
            rel: 'and',
            cond: cond
        },
        limit: 100,
        
    }).then((res) => {
        dispatch({
            type: ActionTypes.YS_GET_SHOP_LIST,
            data: res.data?.data || []
        })
        if(res.data.data && res.data.data.length && from === 'login'){
            dispatch(getShopInfo(res.data.data[0].self_entity_id))
        }
        Taro.hideLoading()
        resolve && resolve()
    })
}
// 获取门店信息
export const getShopInfo = (shopId,resolve) => dispatch => {
    Taro.showLoading({
        title: '加载中',
    })
    jdyApi.post('entry/data/list',{
        app_id: YS_APP_ID,
        entry_id: YS_SHOP_TABLE_ID,
        filter: {
            rel: 'and',
            cond: [
                {
                "field": "self_entity_id",
                "method": "eq",
                "value": shopId
                }
            ]
        },
        limit: 100,
        
    }).then((res) => {
        Taro.hideLoading()
        dispatch({
            type: ActionTypes.YS_GET_SHOP_INFO,
            data: res.data?.data || []
        })
        resolve && resolve()
    })
}
// 修改门店信息
export const modifyShopItem = (parmars) => dispatch => {
    Taro.showLoading({
        title: '加载中',
    })
    const {
        data,
        dataId,
    } = parmars
    jdyApi.post('entry/data/update', {
        app_id: YS_APP_ID,
        entry_id: YS_SHOP_TABLE_ID,
        data_id: dataId,
        is_start_trigger: true,
        data: {
            entity_name: data.entity_name,
            self_entity_id: data.self_entity_id,
            order_user_list: {
                value: data.order_user_list.map(item => {
                    return {
                        id: { value: item.id},
                        phone:{ value: item.phone},
                        user_name: { value: item.user_name },
                    }
                })
            }
        }
        
    }).then((res) => {
        Taro.hideLoading()
        dispatch(getShopList({
            isAdmin: true
        }))
        Taro.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000,
            complete: () => {
              // 2秒后跳转到指定页面
              setTimeout(() => {
                Taro.switchTab({
                    url: `/pages/user/index`
                });
              }, 1000)
            }
          })
        
    })
}

export const changeUserPageStatus = (value) => ({
    type: ActionTypes.INIT_SHOP_STATUS_FOR_USER,
    shopChanged: value
})

export const changeCurrentShop = () => dispatch => {
    dispatch({type: ActionTypes.INIT_SHOP_STATUS_FOR_USER, shopChanged: true})
    dispatch({type: ActionTypes.INIT_SHOP_STATUS_FOR_SHOP, shopChanged: true})
    dispatch({type: ActionTypes.INIT_SHOP_STATUS_FOR_STOCK, shopChanged: true})
}