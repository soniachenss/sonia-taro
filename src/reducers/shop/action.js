
import * as ActionTypes from './ActionTypes';
import jdyApi from '@/services/jdyApi'
import Taro from '@tarojs/taro'
import {
    YS_APP_ID,
    YS_STOCK_PLACE_TABLE_ID,
    YS_STOCK_NUMBER_TABLE_ID,
    YS_SHOP_STOCK_LIST_TABLE_ID,
    YS_STOCK_NUMBER_DRAFT_TABLE_ID,
    YS_STOCK_FAULT_TABLE_ID,
} from '@/services/Limit.js'
// 获取门店储存位置
export const getShopStockCtgy = (parmars) => (dispatch, getState) => {
    const {
        date,
        shopId,
    } = parmars
    const currentShop = getState().userState.currentShop
    const _shopId = shopId ? shopId : currentShop.self_entity_id
    jdyApi.post('entry/data/list',{
        app_id: YS_APP_ID,
        entry_id: YS_STOCK_PLACE_TABLE_ID,
        filter: {
            rel: 'and',
            cond: [
                {
                    "field": "self_entity_id",
                    "method": "eq",
                    "value": _shopId
                },
            ],
        },
        
        limit: 100
    }).then((res) => {
        dispatch({
            type: ActionTypes.GET_SHOP_STOCK_CTGY_LIST,
            data: res.data.data.sort((x,y)=> x.sort_value - y.sort_value) || []
        })
        
    })
    
}
// 获取虾酱蟹酱容错率
export const getShopStockFaultValue = () => (dispatch) => {
   
    const mapData = new Map()
    const getDataLoop = (data_id) => {
        jdyApi.post('entry/data/list',{
            app_id: YS_APP_ID,
            entry_id: YS_STOCK_FAULT_TABLE_ID,
            fields:['fault_tolerance_value','fault_tolerance_persent','stock_name'],
            data_id,
            limit: 100,
            
        }).then((res) => {
            res.data.data.map(item => {
                mapData.set(item.stock_name,{
                    value: item.fault_tolerance_value,
                    persent: item.fault_tolerance_persent
                })
            })
            if(res.data.data && res.data.data.length === 100 ){
                getDataLoop(res.data.data[res.data.data.length-1]._id)
            }else{
                dispatch({
                    type: ActionTypes.GET_SHOP_STOCK_FAULT_VALUE,
                    data: mapData
                })
                Taro.hideLoading()
            }
            
        })
    }
    getDataLoop('')
    
}

// 获取门店库存列表
export const getShopStockList = (parmars) => (dispatch,getState) => {
    const {
        date,
        isJp,
        ctgyName = '全部',
        // shopId = '00659053',
        shopId,
    } = parmars
    let shopList = []
    Taro.showLoading({
        title: '加载中',
    })
    const currentShop = getState().userState.currentShop
    const _shopId = shopId ? shopId : currentShop.self_entity_id
    // const testDate = new Date().getHours() < 12 ? '2024-07-22' : date
    let cond = [
        {
            "field": "date_str",
            "method": "eq",
            "value": date
            // "value": '2024-07-22'
        },
        {
            "field": "self_entity_id",
            "method": "eq",
            "value": _shopId
        },

    ]
    if(isJp){
        cond.push({
            "field": "is_daily",
            "method": "eq",
            "value": '是' 
        })
    }
    if(ctgyName !== '全部'){
        cond.push({
            "field": "storage_area",
            "method": "eq",
            "value": ctgyName 
        })
    }
    const getDataLoop = (data_id) => {
        jdyApi.post('entry/data/list',{
            app_id: YS_APP_ID,
            entry_id: YS_SHOP_STOCK_LIST_TABLE_ID,
            data_id,
            filter: {
                rel: 'and',
                cond
            },
            limit: 100,
            
        }).then((res) => {
            shopList = shopList.concat(res.data.data)
            if(res.data.data && res.data.data.length === 100 ){
                getDataLoop(res.data.data[res.data.data.length-1]._id)
            }else{
                dispatch({
                    type: ActionTypes.GET_SHOP_STOCK_LIST,
                    data: shopList || [],
                    ctgyName,
                    isJp,
                })
                Taro.hideLoading()
            }
            
        })
    }
    getDataLoop('')
    
}
export const getShopStockListFromCtgy = (parmars, callback) => dispatch => {
    const {
        isJp,
        ctgyName,
    } = parmars
    dispatch({
        type: ActionTypes.GET_SHOP_STOCK_LIST_FROM_CTGY,
        isJp,
        ctgyName
    })
    setTimeout(()=>{
        callback && callback()
    },500)
    
}
// 修改纠偏/全盘数据
export const changeShopStockList = (list) => ({
    type: ActionTypes.CHANGE_SHOP_ALL_STOCK_DATA,
    list,
}) 
// // 修改纠偏/全盘数据
// export const changeTabPageIsModify = (isModify) => ({
//     type: ActionTypes.CHANGE_SHOP_STOCK_IS_MODIFY,
//     isModify,
// }) 
// 纠偏保存
export const saveShopStockList = (parmars, successBack) => (dispatch,getState) => {
    const {
        type = 'SUBMIT',
        date,
        list = []

    } = parmars

    Taro.showLoading({
        title: '加载中',
    })
    // const allShopStockList = getState().shopState.allShopStockList
    const allShopStockList = list
    const pageTabValue = getState().shopState.pageTabValue
    const currentShop = getState().userState.currentShop
    const userInfo = getState().homeState.userInfo
    const postData = allShopStockList.map(item => {
        return {
            'stock_name':  { value: item.stock_name },
            'stock_unit': { value: item.stock_unit },
            'stock_number': { value: item.predict_theoretical_number },
        }
    })
    const dataArr = postData.reduce((acc, curr, index) => {
        const chunkIndex = Math.floor(index / 200);
        if (!acc[chunkIndex]) {
          acc[chunkIndex] = [];
        }
        acc[chunkIndex].push(curr);
        return acc;
    }, []);
    const isoDateString = new Date().toISOString();
    // console.log('dataArr======',dataArr);
    for(let i = 0; i < dataArr.length ; i++){
        const data = {
            app_id: YS_APP_ID,
            entry_id: type === 'SUBMIT' ? YS_STOCK_NUMBER_TABLE_ID : YS_STOCK_NUMBER_DRAFT_TABLE_ID,
            data: {
                'self_entity_id': {value: currentShop.self_entity_id},
                'self_entity_name': {value: currentShop.entity_name},
                'stock_list': {value: dataArr[i]},
                'check_type': { value: pageTabValue === 'JP' ? '纠偏' : '全盘' },
                'check_time': { value: isoDateString },
                'user_name': { value : userInfo.user_name},
            },
            is_start_trigger: true
            
        }
        jdyApi.post('entry/data/create',data).then((res) => {
            if(i === dataArr.length - 1){
                Taro.hideLoading()
                successBack && successBack()
                dispatch(changeShopStockList(list))
                
            }
        })
    }

    
    
}
export const changeShopPageStatus = (value) => ({
    type: ActionTypes.INIT_SHOP_STATUS_FOR_SHOP,
    shopChanged: value
})
export const changeShopPopupIndex = (value) => ({
    type: ActionTypes.SHOP_CHANGE_POPUP_INDEX,
    value
})