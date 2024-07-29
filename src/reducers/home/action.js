import * as ActionTypes from './ActionTypes';
import api from '@/services/api'
import jdyApi from '@/services/jdyApi'
import Taro ,{
    login,
    setStorageSync,
    getStorageSync,
} from '@tarojs/taro'
import { Toast } from "@taroify/core"
import {
    YS_APP_ID,
    YS_SHOP_TABLE_ID,
    YS_USER_TABLE_ID,
    YS_USER_SHOP_TABLE_ID,
} from '@/services/Limit.js'
import {
    getShopList,
} from '@/reducers/user/action'
import {
    changeShopPageStatus,
} from '@/reducers/shop/action'

// export const getWxLimits = () => dispatch => {
//   // 获取手机号
//   console.log('获取手机号');
//   wx.getUserProfile({
//     desc: '用于登录', // 必填，声明获取用户个人信息后的用途
//     success: (res) => {
//       // 获取到用户信息不包含手机号
//       // 需要将code发送到服务器
//       console.log('res:',res);
//       dispatch(appLogin())
//     }
//   });
// }


export const appLogin = (successback, failCallback) => dispatch => {
    Taro.showLoading({
        title: '加载中',
    })
    login({
        success(res) {
            if (res.code) {
                //发起网络请求
                api.post('ENT-FILE/open/api/execute/monitor?accessKey=2aca63c74a5849b2a79c7371a1fe9ed1&apiKey=e3a4d76683b04801b8d91ff446bbf530', {
                    js_code: res.code
                }).then((res) => {
                    Taro.hideLoading()
                    const resData = res.data;
                    if (resData.code === 0) {
                        setStorageSync('openid', resData.data.openid);
                        setStorageSync('session_key', resData.data.session_key);
                        Taro.getSystemInfo().then((info)=>{
                            dispatch({
                                type: ActionTypes.YS_SYSTEM_INFO,
                                data: info
                            })
                        })
                        dispatch(getUserInfoForLogin(resData.data.openid, successback, failCallback))
                    } else {
                        Taro.hideLoading()
                        Toast.open(`登录失败，${resData.data.message}`)
                    }
                })
            } else {
                Taro.hideLoading()

                Toast.open(`登录失败，${res.errMsg}`)
            }
        }
    })
}
// 用户表查找是否存在微信openId
export const getUserInfoForLogin = (openId, successback, failCallback) => dispatch => {
    Taro.showLoading({
        title: '加载中',
    })
    jdyApi.post('entry/data/list', {
        app_id: YS_APP_ID,
        entry_id: YS_USER_TABLE_ID,
        // fields: ['wechat_open_id','phone'],
        filter: {
            rel: 'and',
            cond: [{
                entry_id: YS_USER_TABLE_ID,
                type: 'text',
                "field": "wechat_open_id",
                "method": "in",
                "value": [openId]
            }]
        },
        limit: 100,

    }).then((res) => {
        Taro.hideLoading()
        const resData = res.data
        if (resData.data.length) { //存在-
            const userInfo = resData.data.find(item => item.wechat_open_id === openId)

            dispatch({
                type: ActionTypes.YS_CHANGE_USER_INFO,
                userInfo: userInfo
            })
            // setTimeout(()=>{
            //     // dispatch(getShopUserInfo({
            //     //     isAdmin: resData.data[0].is_admin === '是',
            //     //     phone: resData.data[0].phone
            //     // }, successback, failCallback))
                
            // })
            dispatch(getUserShopListInfo({
                isAdmin: resData.data[0].is_admin === '是',
                phone: resData.data[0].phone
            }, successback, failCallback))

        }else{
            // Taro.navigateTo({
            //     url: '/pages/login/index'
            // })
            // Toast.open(`登录失败，当前用户不存在`)
        }
    })
}


// 获取手机号授权
export const getLoginPhone = (parmars, failback) => dispatch => {
    const {
        code
    } = parmars
    api.post('ENT-FILE/open/api/execute/monitor?accessKey=2aca63c74a5849b2a79c7371a1fe9ed1&apiKey=9c005fec441a4e18b17a0467b1c2aa87', {
        code,
    }).then((res) => {
        const resData = res.data

        // dispatch({
        //     type: ActionTypes.YS_GET_PHONE_LOGIN,
        //     phoneNumber: resData.data.phoneNumber
        // })
        const openId = getStorageSync('openid')
        dispatch(searchUserPhone({
            phone: resData.data.phoneNumber,
            openId,

        }, failback))

    }).catch(e => {
        console.log('error:', e);
    })
}
// 查找用户号码是否存在
export const searchUserPhone = (parmars, failback) => dispatch => {
    const {
        phone,
        openId = ''
    } = parmars
    // 根据手机号查找对应数据data_id -用户表
    jdyApi.post('entry/data/list', {
        app_id: YS_APP_ID,
        entry_id: YS_USER_TABLE_ID,
        filter: {
            rel: 'and',
            cond: [{
                "field": "phone",
                "method": "eq",
                "value": phone
            }]
        },
        limit: 100,

    }).then((res) => {
        const resData = res.data
        if (resData.data.length) { //存在
            if (!openId) {
                dispatch({
                    type: ActionTypes.YS_GET_PHONE_LOGIN,
                    phoneNumber: '',
                    userShopList: [],
                })
                // Taro.navigateTo({
                //     url: `/pages/login/index`
                // });
                failback && failback()
            } else {
                dispatch({
                    type: ActionTypes.YS_CHANGE_USER_INFO,
                    userInfo: resData.data[0]
                })
                // 根据data_id修改微信openId
                dispatch(modifyLoginOpenId({ dataId: resData.data[0]._id, openId }))

                dispatch(getUserShopListInfo({
                    isAdmin: resData.data[0].is_admin === '是',
                    phone: resData.data[0].phone
                }, ()=>{
                    dispatch(changeShopPageStatus(true))
                    Taro.switchTab({
                        url: `/pages/shop/index`
                    });
                }, failback))
               
            }

        } else {
            failback && failback()
            dispatch({
                type: ActionTypes.YS_GET_PHONE_LOGIN,
                phoneNumber: '',
                userShopList: [],
            })
            // Taro.navigateTo({
            //     url: `/pages/login/index`
            // });
        }
    })


}
// 查找门店 用户信息是否存在
export const getUserShopListInfo = ({ phone, isAdmin }, successback, failback) => dispatch => {
    Taro.showLoading({
        title: '加载中',
    })
    jdyApi.post('entry/data/list', {
        app_id: YS_APP_ID,
        entry_id: YS_SHOP_TABLE_ID,
        filter: {
            "rel": "and",
            "cond": [
                { 
                    entry_id: YS_SHOP_TABLE_ID,
                    has_empty: false,
                    sub_field: 'phone',
                    subform: 'order_user_list',
                    "method": "in", 
                    type:'text',
                    "value": [phone]
                },
                { 
                    entry_id: YS_SHOP_TABLE_ID,
                    field: 'can_use',
                    "method": "in", 
                    type:'text',
                    "value": ['是']
                },
            ]
        },
        limit: 100,
    }).then((res) => {
        Taro.hideLoading()
        const resData = res.data
        if(isAdmin || resData.data.length){
            
            dispatch({
                type: ActionTypes.YS_GET_SHOP_INFO,
                data: resData.data,
            })
            dispatch({
                type: ActionTypes.YS_GET_PHONE_LOGIN,
                phoneNumber: phone,
                userShopList: resData.data,
                isAdmin
            })
            // 获取所有门店（管理员）或者用户所在的门店（非管理员）
            dispatch(getShopList({
                isAdmin: true,
                userShopList: resData.data,
                from:'login'
            }))
            dispatch({
                type: ActionTypes.GET_USER_SHOP_LIST,
                data: resData
            })

            setTimeout(()=>{
                successback && successback()
            })
            // Taro.switchTab({
            //     url: `/pages/shop/index`
            // });
            

        }else{
            failback && failback()
            dispatch({
                type: ActionTypes.YS_GET_PHONE_LOGIN,
                phoneNumber: '',
                userShopList: [],
                isAdmin: false
            })
        }
        
    })
}

// // 查找用户-门店 用户信息是否存在
// export const getShopUserInfo = ({ phone, isAdmin }, successback, failback) => dispatch => {

//     jdyApi.post('entry/data/list', {
//         app_id: YS_APP_ID,
//         entry_id: YS_USER_SHOP_TABLE_ID,
//         filter: {
//             "rel": "and",
//             "cond": [{ "field": "phone", "method": "eq", "value": phone }]
//         },
//     }).then((res) => {
//         const resData = res.data

//         if (isAdmin || resData.data.length) {
//             dispatch({
//                 type: ActionTypes.YS_GET_PHONE_LOGIN,
//                 phoneNumber: phone,
//                 userShopList: resData.data,
//                 isAdmin
//             })
//             dispatch(getShopList({
//                 isAdmin: isAdmin,
//                 userShopList: resData.data
//             }))
//             successback && successback()

//             Taro.switchTab({
//                 url: `/pages/shop/index`
//             });
//             dispatch({
//                 type: ActionTypes.GET_USER_SHOP_LIST,
//                 data: value
//             })
//         } else {
//             failback && failback()
//             dispatch({
//                 type: ActionTypes.YS_GET_PHONE_LOGIN,
//                 phoneNumber: '',
//                 userShopList: [],
//                 isAdmin: false
//             })
//             // 
//         }

//     })
// }

// 修改用户号码对应的微信openId
export const modifyLoginOpenId = (parmars) => () => {
    const {
        dataId,
        openId
    } = parmars
    jdyApi.post('entry/data/update', {
        app_id: YS_APP_ID,
        entry_id: YS_USER_TABLE_ID,
        data_id: dataId,
        data: {
            wechat_open_id: { value: openId },
        }

    }).then((res) => {
        if(!openId){
            Taro.navigateTo({
                url: '/pages/index/index'
            })
        }

    })
    
}

export const changeTabFun = (value) => ({
    type: ActionTypes.CHANGE_TAB_VALUE,
    data: value
})

// 是否有修改操作
export const changePageContentIsModify = (isModify) => ({
    type: ActionTypes.CHANGE_PAGE_CONTENT_IS_MODIFY,
    isModify,
}) 
// 自定义键盘显示
export const changeKeyBoardShow = (activeValue) => ({
    type: ActionTypes.CHANGE_KEY_BOARD_SHOW,
    activeValue,
}) 

export const loginOut = () => dispatch => {
    dispatch({type: ActionTypes.INIT_HOME_STATE})
    dispatch({type: ActionTypes.INIT_SHOP_STATE})
    dispatch({type: ActionTypes.INIT_STOCK_STATE})
    dispatch({type: ActionTypes.INIT_USER_STATE})
}